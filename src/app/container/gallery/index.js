import { useEffect, useState } from "react";
import KEYS from "../../../keys";
import { TextField } from "@mui/material";
import { Input } from "@mui/material";
import { Button } from "@mui/material";
import { ImageList } from "@mui/material";
import { ImageListItem } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import FavoriteIcon from "@mui/icons-material/Favorite";
import DownloadRoundedIcon from '@mui/icons-material/DownloadRounded';
import IconButton from "@mui/material/IconButton";
import toast from "react-hot-toast";
import ImageListItemBar from "@mui/material/ImageListItemBar";
import FullImageDialog from "./component/FullImageDialog";
import NotFound from "./component/NotFound";
import InfiniteScroll from "react-infinite-scroll-component";
import Popover from '@mui/material/Popover';
import { useWindowSize } from "../../hooks/useWindowSize";


function Gallery() {


  const [searchValue, setSearchValue] = useState("car");
  const [images, setImages] = useState([]);
  const [imageDetails, setImageDetails] = useState({
    src: "",
    alt: "",
    name: "",
  });
  const [page, setPage] = useState(1);
  const [open, setOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const openPopOver = Boolean(anchorEl);
  const [likesCount, setLikesCount] = useState("")
  const [windowWidth, setWindowWidth] = useState(window.innerWidth)


  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth)
    }

    window.addEventListener("resize", handleResize)

    return () => window.removeEventListener("resize", handleResize)
  }, [windowWidth])
  


  /** getting all images */
  const getImages = (defaultPage) => {

    const API_URL = `https://api.unsplash.com/search/photos?page=${defaultPage ? defaultPage : page
      }&per_page=12&query=${searchValue}&client_id=${KEYS.AccessKey}`;


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
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleImageClick = (src, alt, name) => {
    setImageDetails({ src, alt, name });
    setOpen(true);
  };


  const handleFavoriteIconClick = (event, clickeedItem) => {

    setAnchorEl(event.currentTarget);
    setLikesCount(clickeedItem.likes)

    setImages((preValues) => {
      let newImages = []
      for (let i = 0; i < preValues.length; i++) {
        if (preValues[i].id === clickeedItem.id) {
          newImages.push({ ...preValues[i], liked_by_user: !preValues[i].liked_by_user })
        } else {
          newImages.push(preValues[i])
        }
      }
      return newImages
    })

    setTimeout(() => {
      handlePopOverClose()
    }, 700);

  }


  const handlePopOverClose = () => {
    setAnchorEl(null);
  };


  const downloadImage = (clickeedItem) => {

    let url = `${clickeedItem.links.download_location}&client_id=${KEYS.AccessKey}`

    fetch(url).then((res) => {
      return res.json()
    }).then((urlObjet) => {
      console.log({ urlObjet });

      fetch(urlObjet.url).then((res) => {
        return res.blob()
      }).then((blobData) => {

        const imageUrl = window.URL.createObjectURL(blobData)

        console.log({ imageUrl });

        let a = document.createElement("a")
        a.href = imageUrl
        a.setAttribute("download", `${clickeedItem.alt_description}.png`)
        a.click()

      })

    })

  }


  /** getting images on mount */
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
          hasMore={images.length > 0 ? true : false}
          loader={<h6>Loading...</h6>}
        >
          {" "}
          {/* <div className="grid  sm:grid-cols-2 md:grid-cols-4  xl:grid-cols-6 "> */}
          <ImageList variant="masonry"
            cols={Math.round(windowWidth/250)}
            gap={6}>
            {images.length > 1 ? (
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
                      srcSet={`${item.urls.small}?w=248&fit=crop&auto=format&dpr=2 2x`}
                      alt={item.alt_description}
                      loading="lazy"
                    />

                    {/* image footer bar */}
                    
                    <ImageListItemBar
                      position="bottom"
                      title={item.user.name}
                      actionIcon={
                        <>
                          <IconButton
                            sx={{ color: "white" }}
                            onClick={e => handleFavoriteIconClick(e, item)}
                          >
                            <FavoriteIcon sx={{ color: item.liked_by_user ? "red" : "white" }} />
                          </IconButton>
                          <IconButton
                            sx={{ color: "white" }}
                            onClick={e => downloadImage(item)}
                          >
                            <DownloadRoundedIcon />
                          </IconButton>
                        </>
                      }
                    />

                  </ImageListItem>
                );
              })) : <NotFound />}

            {/* </div> */}
          </ImageList>
        </InfiniteScroll>

      </div>
      {/* Favourite icon clicked popup */}
      <Popover
        // id={id}
        open={openPopOver}
        anchorEl={anchorEl}
        onClose={handlePopOverClose}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        sx={{
          boxShadow: "none",
          background: "transparent",
          color: "red",
          "& .MuiPaper-root": {
            background: "transparent !important",
            boxShadow: "none !important",

          }
        }}
      >
        <span style={{
          boxShadow: "none",
          background: "transparent",
          color: "red",
          fontWeight: "bolder"
        }}>  {likesCount} <FavoriteIcon sx={{
          boxShadow: "none",
          background: "transparent",
          color: "red",
        }} /></span></Popover>

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
