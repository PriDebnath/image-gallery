import { useEffect, useState } from "react";
import "./App.css";
import "./dist/output.css"
import KEYS from "./keys";
import { TextField } from "@mui/material";
import { Input } from "@mui/material";
import { Button } from "@mui/material";
import { ImageList } from "@mui/material";
import { ImageListItem } from "@mui/material";
import SearchIcon from '@mui/icons-material/Search';

function App() {
  const [searchValue, setSearchValue] = useState("office");
  const [images, setImages] = useState([]);
  console.log(process.env.REACT_APP_AccessKey);

  const getImages = () => {
    const API_URL = `https://api.unsplash.com/search/photos?page=1&query=${searchValue}&client_id=${KEYS.AccessKey}`;

    fetch(API_URL)
      .then((response) => {
        console.log(response);
        return response.json();
      })
      .then((data) => {
        console.log(data);
        setImages(data.results);
      })
      .catch((error) => {
        console.log(error);
      });
    console.log("getting images", KEYS.AccessKey);
  };

  useEffect(() => {
    getImages()
  }, []);
  return (
    <div>
      <div className="input_container">
        <Input
          type="text"
          variant='filled'
          sx={{textAlign:"center"}}
          InputProps={{
            startAdornment: <SearchIcon/>,
          }}
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
        />
        <Button onClick={getImages} variant='outlined'>Get images</Button>
      </div>

      <div className="p-8 bg-slate-500 input_container">
        <ImageList
          sx={{ width: 600, height: 450 }}
          variant="woven"
          cols={3}
          gap={8}
        >
          {images.map((item, i) => (
            <ImageListItem key={i}>
              <img
                src={`${item.urls.full}?w=164&h=164&fit=crop&auto=format`}
                srcSet={`${item.urls.full}?w=164&h=164&fit=crop&auto=format&dpr=2 2x`}
                alt={item.alt_description}
                loading="lazy"
              />
            </ImageListItem>
          ))}
        </ImageList>
      </div>
    </div>
  );
}

export default App;
