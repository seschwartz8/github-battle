import React, {Component} from 'react';
import PropTypes from 'prop-types';
import { fetchPopularRepos } from '../utils/api';
import { FaUser, FaStar, FaCodeBranch, FaExclamationTriangle } from 'react-icons/fa';
import Card from './Card';
import Loading from './Loading';
import Tooltip from './Tooltip';


function LanguagesNav({selected, onUpdateLanguage}) {
    const languages = ["All", "Ruby", "Javascript", "Java", "CSS", "Python"]

    return (
        <div>
            <ul className="flex-center">
                {languages.map(language =>
                <li key={language}>
                    <button 
                        onClick={() => onUpdateLanguage(language)} 
                        style={language === selected ? { color: 'maroon' } : null}
                        className="btn-clear nav-link">
                        {language}
                    </button>
                </li>
                )}
            </ul>
        </div>
    )
}

LanguagesNav.propTypes = {
    selected: PropTypes.string.isRequired,
    onUpdateLanguage: PropTypes.func.isRequired
}

function ReposGrid({ repos }) {
    return (
        <ul className='grid space-around'>
            {repos.map((repo, index) => {
                const { name, owner, html_url, stargazers_count, forks, open_issues } = repo
                const { login, avatar_url } = owner

                return (
                    <li key={html_url}>
                        <Card
                            header={`#${index + 1}`}
                            avatar={avatar_url}
                            href={html_url}
                            name={login}
                        >
                            <ul className='card-list'>
                                <li>
                                    <Tooltip text="Github username">
                                        <FaUser color='rgb(255, 191, 116)' size={22} />
                                        <a href={`https://github.com/${login}`}>
                                            {login}
                                        </a>
                                    </Tooltip>
                                </li>
                                <li>
                                    <FaStar color='rgb(255, 215, 0)' size={22} />
                                    {stargazers_count.toLocaleString()} stars
                                </li>
                                <li>
                                    <FaCodeBranch color='rgb(129, 195, 245)' size={22} />
                                    {forks.toLocaleString()} forks  
                                </li>
                                <li>
                                    <FaExclamationTriangle color='rgb(241, 138, 147)' size={22} />
                                    {open_issues.toLocaleString()} open
                                </li>
                            </ul>
                        </Card>
                    </li>
                )    
            })}
        </ul>
    )
}

ReposGrid.propTypes = {
    repos: PropTypes.array.isRequired
}

class Popular extends Component {
    constructor(props) {
        super(props)

        this.state={
            selectedLanguage: "All",
            repos: {},
            error: null
        }
    this.updateLanguage = this.updateLanguage.bind(this)
    this.isLoading = this.isLoading.bind(this)
    }

    componentDidMount() {
        this.updateLanguage(this.state.selectedLanguage)
    }

    updateLanguage(selectedLanguage){
        const { error } = this.state

        this.setState({
            selectedLanguage,
            error: null,
        })

        if (!this.state.repos[selectedLanguage]) { //only fetch if you don't already have cached    
            fetchPopularRepos(selectedLanguage)
                .then((data) => { //set data as property on repos object
                    this.setState(({ repos }) => ({
                        repos: {//take all values on current repos and merge with new data
                            ...repos, 
                            [selectedLanguage]: data //assign new data on the selected language to its key
                        }
                    }))
                })
                .catch(() => {
                    console.warn('Error fetching repos: ', error) //if error, warn the developer

                    this.setState({ //warn the user if error
                        error: 'There was an error fetching the repositories.'
                    })
                }) 
        }

    }

    isLoading() { //returns if that repo hasn't cached yet and no errors -- aka it's loading
        const { selectedLanguage, repos, error } = this.state
        return !repos[selectedLanguage] && this.state.error === null
    }

    render() {
        const { selectedLanguage, repos, error } = this.state

        return(
            <React.Fragment>
                <LanguagesNav 
                    selected={selectedLanguage}
                    onUpdateLanguage={this.updateLanguage}
                />
                {this.isLoading() && <Loading text='Fetching Repos'/>}  {/*display LOADING if loading*/}

                {error && <p>{error}</p>}  {/*display error message if error*/}

                {repos[selectedLanguage] && <ReposGrid repos={repos[selectedLanguage]} />} {/*display repos object as string*/}
            </React.Fragment>
        )
    }
}



export default Popular;
