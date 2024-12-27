import Carousel from 'react-bootstrap/Carousel';
import { useEffect, useState } from 'react';
import { Image, Container } from 'react-bootstrap';

function BlogCarousel({images}) {

  const [blogImages, setBlogImages] = useState([]);

  useEffect(() => {
    setBlogImages(images.split(','));
  }, [images]);

  // Custom styles for the carousel
  const carouselStyles = {
    wrapper: {
      maxWidth: '70%',
      margin: '0 auto',
      overflow: 'hidden',
      borderRadius:'10px'
    },
    imageContainer: {
      position: 'relative',
      paddingTop: '56.25%', // 16:9 aspect ratio
      backgroundColor: '#f8f9fa',
      borderRadius:'10px'
    },
    image: {
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      objectFit: 'cover'
    },
    caption: {
      background: 'rgba(0, 0, 0, 0.5)',
      borderRadius: '4px',
      padding: '1rem'
    }
  };

  return (
    <Container fluid className="p-0">
      <div style={carouselStyles.wrapper}>
        <Carousel 
          interval={5000} 
          controls={true}
          indicators={true}
          pause="hover"
          className="h-100"
        >
          {blogImages.map((image, index) => (
            <Carousel.Item key={index}>
              <div style={carouselStyles.imageContainer}>
                <Image
                  src={image}
                  style={carouselStyles.image}
                  alt={`Slide ${index + 1}`}
                  loading="lazy"
                />
              </div>
              <Carousel.Caption style={carouselStyles.caption}>
                <h3>{index + 1} / {blogImages.length}</h3>
              </Carousel.Caption>
            </Carousel.Item>
          ))}
        </Carousel>
      </div>
    </Container>
  );
}

export default BlogCarousel;