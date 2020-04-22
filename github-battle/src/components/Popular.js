import React, { useEffect, useState, useRef } from 'react';
import PropTypes from 'prop-types';
import { fetchPopularRepos } from '../utils/api';
import {
  FaUser,
  FaStar,
  FaCodeBranch,
  FaExclamationTriangle,
} from 'react-icons/fa';
import Card from './Card';
import Loading from './Loading';
import Tooltip from './Tooltip';

const LanguagesNav = ({ selected, onUpdateLanguage }) => {
  const languages = ['All', 'Ruby', 'Javascript', 'Java', 'CSS', 'Python'];

  return (
    <div>
      <ul className='flex-center'>
        {languages.map((language) => (
          <li key={language}>
            <button
              onClick={() => onUpdateLanguage(language)}
              style={language === selected ? { color: 'maroon' } : null}
              className='btn-clear nav-link'
            >
              {language}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

LanguagesNav.propTypes = {
  selected: PropTypes.string.isRequired,
  onUpdateLanguage: PropTypes.func.isRequired,
};

const ReposGrid = ({ repos }) => {
  return (
    <ul className='grid space-around'>
      {repos.map((repo, index) => {
        const {
          name,
          owner,
          html_url,
          stargazers_count,
          forks,
          open_issues,
        } = repo;
        const { login, avatar_url } = owner;

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
                  <Tooltip text='Github username'>
                    <FaUser color='rgb(255, 191, 116)' size={22} />
                    <a href={`https://github.com/${login}`}>{login}</a>
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
        );
      })}
    </ul>
  );
};

ReposGrid.propTypes = {
  repos: PropTypes.array.isRequired,
};

const popularReducer = (state, action) => {
  switch (action.type) {
    case 'fetch_success':
      return {
        ...state,
        [action.selectedLanguage]: action.payload,
        error: null,
      };
    case 'error':
      return { ...state, error: action.error.message };
    default:
      throw new Error(`That action type isn't supported.`);
  }
};

const Popular = () => {
  const [selectedLanguage, setSelectedLanguage] = useState('All');
  const [state, dispatch] = useReducer(popularReducer, {
    error: null,
  });

  // Keep track of the languages we've already fetched with useRef to simplify useEffect dependency array
  const fetchedLanguages = useRef([]);

  useEffect(() => {
    //only fetch if you don't already have cached

    if (!fetchedLanguages.current.includes(selectedLanguage)) {
      fetchedLanguages.current.push(selectedLanguage);

      fetchPopularRepos(selectedLanguage)
        .then((data) => {
          dispatch({ type: 'fetch_success', selectedLanguage, payload: data });
        })
        .catch((error) => {
          dispatch({ type: 'error', error });
        });
    }
  }, [fetchedLanguages, selectedLanguage]);

  const isLoading = () => {
    //returns if that repo hasn't cached yet and no errors -- aka it's loading
    return !state[selectedLanguage] && error === null;
  };

  return (
    <React.Fragment>
      <LanguagesNav
        selected={selectedLanguage}
        onUpdateLanguage={setSelectedLanguage}
      />
      {/*display LOADING if loading*/}
      {isLoading() && <Loading text='Fetching Repos' />}{' '}
      {/*display error message if error*/}
      {state.error && <p>{state.error}</p>}
      {/*display repos object as string*/}
      {state[selectedLanguage] && (
        <ReposGrid repos={state[selectedLanguage]} />
      )}{' '}
    </React.Fragment>
  );
};

export default Popular;
