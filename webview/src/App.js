import axios from "axios";
import { useEffect, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import "./App.css";

function App() {
  const [data, setData] = useState([]);
  const [query, setQuery] = useState("code");
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [size, setSize] = useState('full')
  const [message, setMessage] = useState('')
  const [showMessage, setShowMessage] = useState(false)

  const client_id = "8ba7716aecd63ca73b05122859d1ba50e87e94eb61e9d79bfd5753699fcb3c35";
  const fetchUrl = `https://api.unsplash.com/search/photos?client_id=${client_id}&query=${query}&page=${page}`;

  const fetchImages = () => {
    axios
      .get(fetchUrl, {
        headers: {},
      })
      .then((response) => {
        setData([...data, ...response.data.results]);
      })
      .catch((error) => {
        console.log(error);
      });
    setPage(page + 1);
  };
  const searchImages = (e) => {
    if (e.keyCode === 13) {
      setQuery(e.target.value);
      setData([]);
    }
  };
  
  const getUrlPath = (url) => {
    return url.split('?')[0]
  }

  const getUrl = (url, type) => {
    let result = getUrlPath(url)
    switch(type){
      case 'markdown':
        result = `![${result}](${result})`
        break;
      case 'html':
        result = `<img src="${result}"></img>`
        break
    }
    return result
  }

  const copyUrl = (url) => {
    navigator.clipboard.writeText(url).then(function() {
      notice('复制成功')
    }, function() {
      notice('复制失败')
    })
  }

  const notice = (message) => {
    setShowMessage(true)
    setMessage(message)
    setTimeout(() => {
      setShowMessage(false)
    },  2000)
  }

  useEffect(() => {
    fetchImages();
  }, [query]);

  return (
    <div className="App flex">
      <div className={["tip", showMessage ? 'show' : 'hide'].join(' ')}>{message}</div>
      <input
        type="text"
        onKeyDown={(e) => searchImages(e)}
        placeholder="Search For Images 🔎"
      />
      <InfiniteScroll
        dataLength={data.length}
        next={fetchImages}
        hasMore={hasMore}
        loader={<p>Load more...</p>}
        endMessage={
          <p style={{ textAlign: "center" }}>
            <b>Yay! You have seen it all</b>
          </p>
        }
      >
        <div className="main flex">
          {data.map((data, key) => (
            <div className="container" key={key}>
              <img
                src={data.urls.small}
                className="image"
                alt={data.alt_description}
              />
              <h4>Photo by {data.user.name} </h4>
              <div className="botton-container">
                <p className="copy-button">复制链接</p>
                <div className="popup-dialog">
                  <span>图片链接</span>
                  <div><input className="show-value" value={getUrl(data.urls[size])}></input><button className="confirm-button" onClick={() => copyUrl(getUrl(data.urls[size]))}>Copy</button></div>
                  <span>Markdown</span>
                  <div><input className="show-value" value={getUrl(data.urls[size], 'markdown')}></input><button className="confirm-button" onClick={ () => copyUrl(getUrl(data.urls[size], 'markdown'))}>Copy</button></div>
                  <span>HTML</span>
                  <div><input className="show-value" value={getUrl(data.urls[size], 'html')}></input><button className="confirm-button" onClick={ () => copyUrl(getUrl(data.urls[size], 'html'))}>Copy</button></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </InfiniteScroll>
    </div>
  );
}

export default App;
