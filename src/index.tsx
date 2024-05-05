import { ActionPanel, List, Action, showToast, Toast } from "@raycast/api";
import axios from "axios";
import { useEffect, useState } from "react";

interface Repository {
  name: string;
  description: string;
  url: string;
  stars: number;
}

export default function Command() {
  const [repositories, setRepositories] = useState<Repository[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchRepositories() {
      try {
        const response = await axios.get(
          "https://api.github.com/search/repositories?q=created:>2022-01-01&sort=stars&order=desc"
        );
        const repos = response.data.items.map((item: {
          name: string;
          description: string;
          html_url: string;
          stargazers_count: number;
        }) => ({
          name: item.name,
          description: item.description,
          url: item.html_url,
          stars: item.stargazers_count,
        }));
        setRepositories(repos);
        setIsLoading(false);
      } catch (error) {
          showToast({
            style: Toast.Style.Failure,
            title: "Error",
            message: "Failed to fetch repositories",
          });
          setIsLoading(false);
        }
      }
      
      fetchRepositories();
 
    }, []);

  return (
    <List isLoading={isLoading}>
      {repositories.map((repo) => (
        <List.Item
          key={repo.url}
          title={repo.name}
          subtitle={repo.description}
          accessoryTitle={`⭐ ${repo.stars}`}
          actions={
            <ActionPanel title="Repository Actions">
              <Action
                title="Open in GitHub"
                onAction={() => {
                  Action.OpenInBrowser({ url: repo.url });
                }}
              />
            </ActionPanel>
          }
        />
      ))}
    </List>
  );
}
