import { Link } from "react-router-dom"
import LatestCollection from '../components/LatestCollection'
// import BestSeller from '../components/BestSeller'
import OurPolicy from '../components/OurPolicy'
// import NewsletterBox from '../components/NewsletterBox'
import slider from '../assets/slider.png'
import slider2 from '../assets/slider2.png'
import slid3 from '../assets/slid3.png'
import slider4 from '../assets/slider4.png'
import slider3 from '../assets/slider3.png'

const Home = () => {
  const images = [slider, slider2, slid3, slider4, slider3]

  return (
    <div>
      {/* Bootstrap Carousel */}
      <div
        id="carouselExampleControls"
        className="carousel slide relative z-0"
        data-bs-ride="carousel"
        data-bs-interval="3000"
        style={{ backgroundColor: "#f8f9fa" }}
      >
        <div className="carousel-inner">
          {images.map((img, i) => (
            <div key={i} className={`carousel-item ${i === 0 ? "active" : ""}`}>
              <Link to="/collection" style={{ textAlign: "center" }}>
                <div
                  style={{
                    height: "90vh",
                    width:"100vw",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    backgroundColor: "#fff",
                    cursor: "ponter",
                  }}
                >
                  <img
                    src={img}
                    alt={`Slide ${i + 1}`}
                    style={{
                      maxWidth: "100vw !important",
                      maxHeight: "100vh !important",
                      width: "100% !important",
    height: "100% !important",
                    }}
                  />
                </div>
              </Link>
            </div>
          ))}
        </div>

        {/* Carousel Controls */}
        <button
          className="carousel-control-prev"
          type="button"
          data-bs-target="#carouselExampleControls"
          data-bs-slide="prev"
        >
          <span className="carousel-control-prev-icon" aria-hidden="true"></span>
          <span className="visually-hidden">Previous</span>
        </button>
        <button
          className="carousel-control-next"
          type="button"
          data-bs-target="#carouselExampleControls"
          data-bs-slide="next"
        >
          <span className="carousel-control-next-icon" aria-hidden="true"></span>
          <span className="visually-hidden">Next</span>
        </button>
      </div>

      {/* Sections */}
      <LatestCollection />
      {/* <BestSeller /> */}
      <OurPolicy />
      {/* <NewsletterBox /> */}
    </div>
  )
}

export default Home
