import { get } from "http"

// these constants are in case github rate limits me 
const id = "YOUR_CLIENT_ID"
const sec = "YOUR_SECRET_ID"
const params = `?client_id=${id}&client_secret=${sec}`

function getErrorMsg (message, username) {
    if (message === 'Not Found') {
        return `${username} doesn't exist`
    }

    return message
}

function getProfile (username) {
    return fetch(`https://api.github.com/users/${username}${params}`)
        .then((res) => res.json())
        .then((profile) => {
        if (profile.message) {
            throw new Error(getErrorMsg(profile.message, username))
        }

        return profile
    })
}

function getRepos (username) {
    return fetch(`https://api.github.com/users/${username}/repos${params}&per_page=100`)
        .then((res) => res.json())
        .then((repos) => {
            if (repos.message) {
                throw new Error(getErrorMsg(repos.message, username))
            }

            return repos
        })
}

function getStarCount (repos) { //get each repo's stars by adding them onto previous iteration, starting from 0
    return repos.reduce((count, { stargazers_count }) => count + stargazers_count , 0)
}

function calculateScore (followers, repos) { //calculate score based on followers and stars per repo
    return (followers * 3) + getStarCount(repos)
}

function getUserData (player) {
    return Promise.all([
        getProfile(player),
        getRepos(player)
        ]).then(([ profile, repos ]) => ({
            profile,
            score: calculateScore(profile.followers, repos)
        }))
}

function sortPlayers (players) { //sort by winner
    return players.sort((a, b) => b.score - a.score)
}

export function battle (players) {
    return Promise.all([
        getUserData(players[0]),
        getUserData(players[1])
        ]).then((results) => sortPlayers(results))
}

export function fetchPopularRepos (language) {
    const endpoint = window.encodeURI(`https://api.github.com/search/repositories?q=stars:>1+language:${language}&sort=stars&order=desc&type=Repositories`)

    return fetch(endpoint) //make request to github api
        .then((res) => res.json()) //turn response into json
        .then((data) => { 
            if (!data.items) { //if there aren't any items throw an error
                throw new Error(data.message)
            }
            return data.items //return array of repos if they exist
        })
}