import { useEffect, useState } from "react";
import KEYS from "../../../keys";
import { TextField } from "@mui/material";
import { Input } from "@mui/material";
import { Button } from "@mui/material";
import { ImageList } from "@mui/material";
import { ImageListItem } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import FavoriteIcon from "@mui/icons-material/Favorite";
import IconButton from "@mui/material/IconButton";
import toast from "react-hot-toast";
import ImageListItemBar from "@mui/material/ImageListItemBar";
import FullImageDialog from "./component/FullImageDialog";
import NotFound from "./component/NotFound";
import InfiniteScroll from "react-infinite-scroll-component";

function Gallery() {
  const [searchValue, setSearchValue] = useState("office");
  const [images, setImages] = useState([]);
  const [imageDetails, setImageDetails] = useState({
    src: "",
    alt: "",
    name: "",
  });
  const [page, setPage] = useState(1);
  const [open, setOpen] = useState(false);

  const getImages = (defaultPage) => {
    const API_URL = `https://api.unsplash.com/search/photos?page=${
      defaultPage ? defaultPage : page
    }&per_page=12&query=${searchValue}&client_id=${KEYS.AccessKey}`;

    let toastId;

    fetch(API_URL)
      .then((response) => {
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
        console.log(data);
        toast.dismiss(toastId);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleImageClick = (src, alt, name) => {
    setImageDetails({ src, alt, name });
    setOpen(true);
  };
  useEffect(() => {
    getImages();
  }, []);

  return (
    <>
      <div className="flex justify-center items-center  fixed top-0 z-10 w-full bg-white ">
        <form
          className=" text-center p-2  "
          onSubmit={(e) => {
            e.preventDefault();
            getImages(1);
            window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
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
      </div>
      <div className="p-2 ">
        <InfiniteScroll
          dataLength={images.length}
          next={() => {
            getImages();
          }}
          hasMore={true}
          loader={<h6>Loading...</h6>}
        >
          {" "}
          <div className="grid  sm:grid-cols-2 md:grid-cols-4  xl:grid-cols-6 ">
            {images &&
              images.map((item, i) => {
                return (
                  <ImageListItem
                    key={i}
                    sx={{ margin: "1%", borderRadius: 2, overflow: "hidden" }}
                  >
                    <img
                      onClick={() => {
                        handleImageClick(
                          item.urls.full,
                          item.alt_description,
                          item.user.name
                        );
                      }}
                      src={`${item.urls.small}`}
                      alt={item.alt_description}
                      loading="lazy"
                    />
                    <ImageListItemBar
                      position="bottom"
                      title={item.user.name}
                      actionIcon={
                        <IconButton
                          sx={{ color: "white" }}
                          aria-label={`star ${item.title}`}
                        >
                          <span className="text-sm">
                            {item.likes}
                            <FavoriteIcon />
                          </span>
                        </IconButton>
                      }
                    />
                  </ImageListItem>
                );
              })}
            {!images && <NotFound />}
          </div>
        </InfiniteScroll>
      </div>

      <FullImageDialog
        open={open}
        setOpen={setOpen}
        src={imageDetails.src}
        alt={imageDetails.alt}
        user={imageDetails.name}
      />
    </>
  );
}

export default Gallery;
