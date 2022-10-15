import { useEffect, useState } from "react";
import "./App.css";
import KEYS from "./keys";
import { TextField } from "@mui/material";
import { Input } from "@mui/material";
import { Button } from "@mui/material";
import { ImageList } from "@mui/material";
import { ImageListItem } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import toast, { Toaster } from "react-hot-toast";

function App() {
  const [searchValue, setSearchValue] = useState("office");
  const [images, setImages] = useState([]);
  const [page, setPage] = useState(1);

  const getImages = (defaultPage) => {

    const API_URL = `https://api.unsplash.com/search/photos?page=${
      defaultPage ? defaultPage : page
    }&per_page=30&query=${searchValue}&client_id=${KEYS.AccessKey}`;
    
    let toastId;

    fetch(API_URL)
      .then((response) => {
        toastId = toast.loading("Getting images");
        return response.json();
      })
      .then((data) => {
        if (defaultPage === 1) {
          setImages(data.results);
          setPage(page + 1);
        } else {
          setImages([...images, ...data.results]);
          setPage(page + 1);
        }
        console.log(data)
          toast.dismiss(toastId);
        toast.success("succeed");
      })
      .catch((error) => {
        toast.error("Network error");
        console.log(error);
      });
  };

  useEffect(() => {
     getImages()
  }, []);
  return (
    <>
      <div className="flex flex-col justify-items-center items-center border-2 border-[#1976d2] m-auto p-2 w-[520px] h-screen">
        <form
          className=" text-center "
          onSubmit={(e) => {
            e.preventDefault();
            getImages(1);
          }}
        >
          <Input
            type="text"
            variant="filled"
            sx={{
              textAlign: "center",
              border: 2,
              borderBottom: "none",
              borderColor: "#1976d2",
              paddingLeft: 2,
              paddingRight: 2,
              borderRadius: 1,
              color: "#1976d2",
            }}
            
            endAdornment={
              <SearchIcon
                sx={{
                  cursor: "pointer",
                  color: "#1976d2",
                  textAlign: "center",
                }}
                onClick={() => {
                  getImages(1);
                }}
              />
            }
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
          />
        </form>

        <div className="p-2 overflow-auto">
          <ImageList
            sx={{
              width: 500,
              border: 2,
              borderColor: "#1976d2",
              borderRadius: 1,

              height: "80vh",
            }}
            variant="woven"
            cols={3}
            gap={8}
          >
            {images &&
              images.map((item, i) => {
                return (
                  <ImageListItem key={i}>
                    <img
                      src={`${item.urls.small} `} 
                      // srcSet={`${item.urls.full}?w=164&h=164&fit=crop&auto=format&dpr=2 2x`}
                      alt={item.alt_description}
                      loading="lazy"
                    />
                  </ImageListItem>
                );
              })}
          </ImageList>
        </div>
        <div className="m-auto">
          <Button
            variant="outlined"
            onClick={() => {
              getImages();
            }}
            sx={{ border: 2 }}
          >
            More
          </Button>
        </div>
      </div>
      <Toaster />
    </>
  );
}

export default App;
