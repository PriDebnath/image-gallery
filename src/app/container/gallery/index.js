import { useEffect, useState } from "react";
import KEYS from "../../../keys";
import { TextField } from "@mui/material";
import { Input } from "@mui/material";
import { Button } from "@mui/material";
import { ImageList } from "@mui/material";
import { ImageListItem } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import toast from "react-hot-toast";
import FullImageDialog from "./component/FullImageDialog";
import InfiniteScroll from "react-infinite-scroll-component";

function Gallery() {
    useEffect(() => {
    getImages();
  }, []);
  const [searchValue, setSearchValue] = useState("office");
  const [images, setImages] = useState([]);
  const [imageDetails, setImageDetails] = useState({
    src: "",
    alt: "",
    name :""
  });
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [open, setOpen] = useState(false);

  const getImages = (defaultPage) => {
    console.log(images.length);

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
      //       setImages([...images, ...data.results]);
      //    setPage(page + 1);
        console.log(data);
        toast.dismiss(toastId);
        console.log(images);
        toast.success("Succeed");
      })
      .catch((error) => {
        toast.error("Network error");
        console.log(error);
      });

  };
  

  console.log(typeof(images.length));

  const handleImageClick = (src, alt) => {
    setImageDetails({ src, alt });
    setOpen(true);
    console.log(imageDetails);
  };


  const fetchData =()=>{
    console.log('fetch data called',images.length);
    setPage(page+1)
    getImages()
  }
  return (
    <>
      <div className="flex flex-col justify-items-center items-center border-2 border-[#1976d2] m-auto p-2 w-full md:w-[60%] h-screen">
        <form
          className=" text-center p-2"
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
          <InfiniteScroll
            dataLength={page*10}
            next={()=>{
              fetchData()
              getImages()
            }}
            hasMore={true}
            loader={<h4>Loading...</h4>}
          //  scrollableTarget="scrollableDiv"

            className="grid md:grid-cols-3   xl:grid-cols-5 sm:grid-cols-2 "
          >
              {images && images.map((item, i) => {
                return (
                  <ImageListItem
                    key={i}
                    onClick={() => {
                      handleImageClick(item.urls.full, item.alt_description,item.user.name);
                    }}
                    sx={{padding:"1%"}}
                  >
                    <img
                      src={`${item.urls.small} `}
                      // srcSet={`${item.urls.full}?w=164&h=164&fit=crop&auto=format&dpr=2 2x`}
                      alt={item.alt_description}
                      loading="lazy"
                    />
                  </ImageListItem>
                );
              })}
          </InfiniteScroll>
        </div>
        <div className="m-auto">
          <Button
            variant="outlined"
            onClick={() => {
              getImages();
            }}
            sx={{ border: 2 ,margin:2 }}
          >
            More
          </Button>
        </div>
      </div>
      <FullImageDialog
        open={open}
        setOpen={setOpen}
        src={imageDetails.src}
        alt={imageDetails.alt}
        user={imageDetails.user}
      />
    </>
  );
}

export default Gallery;
