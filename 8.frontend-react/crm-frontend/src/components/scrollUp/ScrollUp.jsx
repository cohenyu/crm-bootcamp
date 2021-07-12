import React, {useState, useEffect} from 'react';
import './scrollUp.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowUp } from '@fortawesome/free-solid-svg-icons'

function ScrollUp(props) {
    const [isVisible, setIsVisible] = useState(false);

    const toggleVisibility = () =>  {
        if (window.pageYOffset > 250) {
            setIsVisible(true);
        } else {
            setIsVisible(false);
        }
      }

    useEffect(() => {
        window.addEventListener("scroll", toggleVisibility);
      }, []);
    
    const scrollToTop = () => {
        window.scrollTo({
          top: 0,
          behavior: "smooth"
        });
    }

    return (
        <div>
            {isVisible && 
                <div className='scroll-container' onClick={scrollToTop}>
                    <FontAwesomeIcon icon={faArrowUp} size='m'/>
                </div>
            }
        </div>
    );
}

export default ScrollUp;
