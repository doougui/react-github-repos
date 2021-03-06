import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import PropTypes from 'prop-types';

import api from '../../services/api';

import Container from '../../components/Container';
import { Loading, Owner, IssueList } from './styles';

export default function Repository() {
  const [repository, setRepository] = useState({});
  const [issues, setIssues] = useState({});
  const [loading, setLoading] = useState(true);

  const { repository: repoName } = useParams();

  useEffect(() => {
    async function fetchData() {
      const [repoInfo, repoIssues] = await Promise.all([
        api.get(`/repos/${repoName}`),
        api.get(`/repos/${repoName}/issues`, {
          params: 'open',
          per_page: 5,
        }),
      ]);

      setRepository(repoInfo.data);
      setIssues(repoIssues.data);
      setLoading(false);
    }

    fetchData();
  }, [repoName]);

  if (loading) {
    return <Loading>Carregando...</Loading>;
  }

  return (
    <Container>
      <Owner>
        <Link to="/">Voltar aos repositórios</Link>
        <img src={repository.owner.avatar_url} alt={repository.owner.login} />
        <h1>{repository.name}</h1>
        <p>{repository.description}</p>
      </Owner>

      <IssueList>
        {issues.map((issue) => (
          <li key={String(issue.id)}>
            <img src={issue.user.avatar_url} alt={issue.user.login} />

            <div>
              <strong>
                <a
                  href={issue.html_url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {issue.title}
                </a>
                {issue.labels.map((label) => (
                  <span key={String(label.id)}>{label.name}</span>
                ))}
              </strong>
              <p>{issue.user.login}</p>
            </div>
          </li>
        ))}
      </IssueList>
    </Container>
  );
}

Repository.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      repository: PropTypes.string,
    }),
  }).isRequired,
};
