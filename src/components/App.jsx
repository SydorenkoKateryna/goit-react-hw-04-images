import { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import getImages from 'api/getImages';
import Searchbar from './Searchbar';
import ImageGallery from './ImageGallery';
import Button from './Button';
import Loader from './Loader';
import css from './App.module.css';

const LIMIT = 12;

const App = () => {
  const [searchImage, setSearchImage] = useState('');
  const [images, setImages] = useState([]);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalImages, setTotalImages] = useState(0);

  const handleSearch = searchImageValue => {
    if (searchImageValue !== searchImage) {
      setSearchImage(searchImageValue);
      setPage(1);
      setImages([]);
    }
  };

  const handleLoadMoreBtnClick = () => {
    setPage(page => page + 1);
  };

  useEffect(() => {
    if (searchImage === '') {
      return;
    }

    setIsLoading(true);

    const fetchImages = async () => {
      return await getImages(searchImage, page);
    };

    fetchImages()
      .then(({ data: { hits, totalHits } }) => {
        if (totalHits === 0) {
          toast.error(
            'Sorry, there are no images matching your search query. Please try again.'
          );

          return;
        } else {
          setTotalImages(totalHits);
        }

        if (page === 1) {
          toast.success(`Hooray! We found ${totalHits} images.`);
        }

        setImages(prev => [...prev, ...hits]);
      })
      .catch(error => {
        error.message = "That's an error ☹️";
        setError(error);
      })
      .finally(() => setIsLoading(false));
  }, [page, searchImage]);

  const isLoadMoreBtnVisible =
    totalImages > LIMIT && page < Math.ceil(totalImages / LIMIT);

  return (
    <div className={css.app}>
      <Searchbar onSubmit={handleSearch} isLoading={isLoading} />

      {error && (
        <h2 className={css.error}>
          {error.request.status}. {error.message}
        </h2>
      )}

      {images.length !== 0 && <ImageGallery images={images} />}

      {isLoading && <Loader />}

      {isLoadMoreBtnVisible && !isLoading && (
        <Button handleClick={() => handleLoadMoreBtnClick()}></Button>
      )}

      <ToastContainer autoClose={3000} position="bottom-right" />
    </div>
  );
};

export default App;
