import React, { useState } from "react";
import axios from "axios";
import GistList from "./components/GistList";
import { IoMdClose } from "react-icons/io";
import Loader from "./components/Loader";

function App() {
  const [username, setUsername] = useState("");
  const [page, setPage] = useState(1);
  const [gists, setGists] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [canGetMore, setCanGetMore] = useState(false);

  const perPage = 10;

  const handleGetNextGists = async () => {
    setPage(current => current + 1);
    await getGists(page + 1, perPage);
  };

  const getGists = async (page = 1, perPage = 10) => {
    setLoading(true);
    setCanGetMore(false);

    const gistsRawData = await axios.get(
      `https://api.github.com/users/${username}/gists?page=${page}&per_page=${perPage}`
    );

    const formattedGists = await Promise.all(
      gistsRawData.data.map(async gistRawData => {
        return await (
          await axios.get(`https://api.github.com/gists/${gistRawData.id}`)
        ).data;
      })
    );

    setGists(current => [...current, ...formattedGists]);

    formattedGists.length === 0 && setMessage("This user has no gists 😳");
    formattedGists.length === perPage && setCanGetMore(true);

    console.log(formattedGists);

    setLoading(false);
  };

  const handleSubmit = async e => {
    e.preventDefault();

    if (loading) return;
    if (username.length < 3) return;

    setPage(1);
    setLoading(true);
    setGists([]);
    setMessage("");
    setCanGetMore(false);

    try {
      await getGists();
    } catch (err) {
      console.log(err);

      if (err.request.status === 404) setMessage("User not found 💩");
      else setMessage("API rate limit exceeded 🤔");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app">
      <div className="searchbar-container">
        <form onSubmit={handleSubmit}>
          <div className="input-container">
            <input
              type="text"
              value={username}
              onChange={e => setUsername(e.target.value)}
              placeholder="Type at least 3 characters"
            />
            {username.length > 0 && <IoMdClose onClick={() => setUsername("")} className="clear-icon" />}
          </div>

          <div className="input-container" onClick={handleSubmit}>
            {loading && (
              <div className="loader-container">
                <Loader />
              </div>
            )}

            <div className={`input-submit ${username.length < 3 && "disabled"}`}>Search</div>
          </div>
        </form>
      </div>

      <GistList
        gists={gists}
        getNextGists={handleGetNextGists}
        message={message}
        canGetMore={canGetMore}
        loading={loading}
      />
    </div>
  );
}

export default App;
