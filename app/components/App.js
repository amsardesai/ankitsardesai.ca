
import * as React from 'react';
import { useCallback, useLayoutEffect, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import Details from './Details.js';
import IconBriefcase from './icons/IconBriefcase.js';
import IconGithub from './icons/IconGithub.js';
import IconKey from './icons/IconKey.js';
import IconLinkedIn from './icons/IconLinkedIn.js';
import IconLocation from './icons/IconLocation.js';
import IconMail from './icons/IconMail.js';

import style9 from 'style9';

// const WIDTH_TO_HEIGHT_RATIO = 1.5;

const emptyFunction = () => {};

const styles = style9.create({
  backgroundLayer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    overflow: 'hidden',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  container: {
    height: '100vh',
    position: 'relative',
    backgroundColor: '#000',
  },
  nameAvatar: {
    width: '3em',
    height: '3em',
    borderRadius: '50%',
  },
  namePill: {
    cursor: 'pointer',
    padding: '0.3em',
    backgroundColor: '#fff',
    boxShadow: '0 0.1em 10px rgba(0,0,0,0.35)',
    animationName: style9.keyframes({
      '0%': { opacity: 0, transform: 'translateY(30px)' },
      '100%': { opacity: 1, transform: 'translateY(0)' },
    }),
    animationDuration: '1s',
  },
  nameHeading: {
    margin: 0,
    fontSize: '2em',
    fontWeight: '500',
    paddingRight: '0.4em',
    marginBottom: -2,
  },
  image: {
    userSelect: 'none',
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'contain',
    backgroundPosition: 'center',
    position: 'absolute',
    top: 0,
    left: 0,
    height: 'calc(100vh * 1.05)',
    width: 'calc(100% * 1.2)',
    marginTop: 'calc(100vh * -0.025)',
    marginLeft: 'calc(100% * -0.1)',
    transformOrigin: 'center center',
    transitionProperty: 'opacity',
    transitionTimingFunction: 'ease-in-out',
    transitionDuration: '1s',
  },
  imageTransitioningIn: {
    opacity: 1,
  },
  imageTransitioningOut: {
    opacity: 0,
  },
  imageFrame: {
    width: '100%',
    maxWidth: 'calc(100vh * 1.575)',
    height: '100vh',
    position: 'relative',
    display: 'flex',
    boxSizing: 'border-box',
    flexDirection: 'column',
    alignItems: 'center',
    paddingTop: 'calc(max(1.5em, 4%))',
    paddingLeft: '1em',
    paddingRight: '1em',
    paddingBottom: '1em',
  },
  imagePreloader: {
    width: 1,
    height: 1,
    opacity: 0,
  },

  linkAnchor: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',

    transitionProperty: 'transform',
    transitionTimingFunction: 'linear',
    transitionDuration: '100ms',
  },
  linkPile: {
    marginTop: '0.6em',
    marginLeft: '1em',
    marginRight: '1em',
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  pill: {
    animationFillMode: 'both',
    borderWidth: '0.15em',
    borderStyle: 'solid',
    borderColor: 'rgba(255,255,255,0.85)',
    backdropFilter: 'brightness(80%) invert(10%) saturate(250%) blur(30px)',
    boxSizing: 'border-box',
    borderRadius: '3em',
    fontFamily: 'inherit',
    display: 'flex',
    position: 'relative',
    alignItems: 'center',
    padding: '0.6em',
    textDecoration: 'none',
    color: 'rgba(0,0,0,0.9)',
    transitionProperty: 'transform, opacity',
    transitionTimingFunction: 'ease-in-out',
    transitionDuration: '2s',
    isolation: 'isolate',
    ':before': {
      backgroundColor: 'rgb(255,255,255)',
      boxShadow: '0 0.1em 10px rgba(0,0,0,0.35)',
      position: 'absolute',
      top: '-0.15em',
      left: '-0.15em',
      right: '-0.15em',
      bottom: '-0.15em',
      zIndex: -1,
      borderRadius: '3em',
      opacity: 0,
      content: '""',
      transitionProperty: 'opacity',
      transitionTimingFunction: 'ease-out',
      transitionDuration: '300ms',
    },
    ':hover:before': {
      opacity: 1,
      transitionDelay: '100ms',
      transitionDuration: '50ms',
    },
    ':focus-visible:before': {
      opacity: 1,
      transitionDuration: '50ms',
    },
  },
  pillIcon: {
    width: '1em',
    height: '1em',
    fill: 'white',
    color: 'white',
    pointerEvents: 'none',
    mixBlendMode: 'difference',
  },
  pillText: {
    paddingLeft: '0.3em',
    paddingRight: '0.1em',
    fontWeight: '400',
    marginBottom: -2,
    color: 'white',
    mixBlendMode: 'difference',
  },
  linkPill: {
    marginLeft: '0.25em',
    marginRight: '0.25em',
    marginBottom: '0.45em',
    animationName: style9.keyframes({
      '0%': { opacity: 0, transform: 'translateX(-20px)' },
      '100%': { opacity: 1, transform: 'translateX(0)' },
    }),
    animationDuration: '1s',
  },
  locationPill: {
    position: 'absolute',
    bottom: '1em',
    right: '1em',
    transitionProperty: 'transform, opacity',
    transitionTimingFunction: 'ease-in-out',
    transitionDuration: '500ms',
    ':after': {
      position: 'absolute',
      top: '-0.55em',
      left: '1em',
      width: 0,
      height: 0,
      borderLeft: '0.4em solid transparent',
      borderRight: '0.4em solid transparent',
      borderBottom: '0.4em solid rgba(255,255,255,1)',
      content: '""',
      opacity: 0.85,
      transitionProperty: 'opacity',
      transitionTimingFunction: 'ease-out',
      transitionDuration: '200ms',
    },
    ':hover:after': {
      opacity: 1,
      transitionDelay: '100ms',
      transitionDuration: '50ms',
    },
    ':focus-visible:after': {
      opacity: 1,
      transitionDuration: '50ms',
    },
  },
  locationPillTransitioningIn: {
    opacity: 1,
    transform: 'translateY(0)',
    transitionDelay: '2s',
  },
  locationPillTransitioningOut: {
    opacity: 0,
    transform: 'translateY(30px)',
    transitionDelay: '0s',
  },
});

/**
 * Delay before moving on to the next photo
 */
const CAROUSEL_DELAY = 15000;

/**
 * Delay before we can push a new photo
 */
const MIN_TIME_PER_PHOTO = 4000;

interface Props {
  initialPhoto: string,
};

export default function App({initialPhoto}: Props): React.MixedElement {
  const dispatch = useDispatch();
  const previousPhoto = useSelector(state => state.previousPhoto);
  const currentPhoto = useSelector(state => state.currentPhoto);
  const transitioning = useSelector(state => state.transitioning);

  const photo = transitioning && previousPhoto != null ? previousPhoto : currentPhoto;

  const imageRef = useRef(null);
  const linkAnchorRef = useRef(null);

  // Preload the image using dummy element
  const preloadImage = useCallback(nextImage => {
    return new Promise((resolve, reject) => {
      if (imageRef.current != null) {
        const imageDiv = imageRef.current;
        const imageElement = document.createElement('img');
        imageElement.setAttribute('aria-hidden', 'true');
        imageElement.setAttribute('class', style9(styles.imagePreloader));
        imageElement.setAttribute(
          'src',
          `https://cdn.ankitsardesai.ca/backgrounds/${nextImage.name}.jpg`,
        );
        imageElement.onload = () => {
          resolve({ name: nextImage.name, location: nextImage.location });
        };
        imageElement.onerror = e => { reject(e) }
        imageDiv.replaceChildren(imageElement);
      }
    });
  }, []);

  const transitionBlockingTimeoutRef = useRef(null);
  const carouselTimeoutRef = useRef(null);
  const preloadedImageRef = useRef(null);

  const blockTransitionsForSomeTime = useCallback(() => {
    clearTimeout(transitionBlockingTimeoutRef.current);
    transitionBlockingTimeoutRef.current = setTimeout(() => {
      transitionBlockingTimeoutRef.current = null;
    }, MIN_TIME_PER_PHOTO);
  }, [])

  // Trigger the next photo if past transition period and next image is preloaded
  const triggerNextPhoto = useCallback(() => {
    const preloadedImage = preloadedImageRef.current;
    if (preloadedImage != null && transitionBlockingTimeoutRef.current == null) {
      clearTimeout(carouselTimeoutRef.current);
      carouselTimeoutRef.current = null;
      dispatch({ type: 'PUSH_NEXT_PHOTO', ...preloadedImage });
    }
  }, [dispatch]);


  // Finish transition for current photo, preload the next photo, and push it in after timer
  const loadNextPhoto = useCallback(() => {
    // Start fading in the image
    dispatch({type: 'SHOW_PHOTO'});

    // Push next photo after timer finishes AND next image is preloaded
    carouselTimeoutRef.current = setTimeout(() => {
      carouselTimeoutRef.current = null;
      triggerNextPhoto();
    }, CAROUSEL_DELAY);

    fetch(`/api/getNextPhoto?previousName=${photo.name}`)
      .then(response => response.json())
      .then(nextImage => preloadImage(nextImage))
      .then(nextImage => {
        preloadedImageRef.current = nextImage;

        if (carouselTimeoutRef.current == null) {
          triggerNextPhoto();
        }
      });

  }, [dispatch, photo.name, triggerNextPhoto]);

  // Preload image when this component mounts, then start carousel
  const hasStartedRef = useRef(false);
  useEffect(() => {
    if (hasStartedRef.current === false) {
      preloadImage(photo).then(loadNextPhoto);
      blockTransitionsForSomeTime();
    }
    hasStartedRef.current = true;
  }, [loadNextPhoto]);

  const prevTransitioningRef = useRef(transitioning);
  useLayoutEffect(() => {
    const imageDiv = imageRef.current;
    if (imageDiv != null) {
      // When transitioning goes from true to false, apply a generated panning animation
      if (!transitioning && prevTransitioningRef.current) {
        const shouldZoomIn = Math.random() > 0.5;
        const initialX = (Math.random() - 0.5) * (shouldZoomIn ? 3.4 : 6);
        const finalX = (Math.random() - 0.5) * (shouldZoomIn ? 6 : 3.4);
        const initialY = (Math.random() - 0.5) * 4;
        const finalY = (Math.random() - 0.5) * 4;
        const startTransform = `scale(${shouldZoomIn ? 1.15 : 1.3}) translate(${initialX}%, ${initialY}%)`;
        const endTransform = `scale(${shouldZoomIn ? 1.3 : 1.15}) translate(${finalX}%, ${finalY}%)`;

        const animation = imageDiv.animate(
          [{ transform: startTransform }, { transform: endTransform }],
          { duration: CAROUSEL_DELAY + MIN_TIME_PER_PHOTO, iterations: 1 },
        );
        imageDiv.style.setProperty('transform', endTransform);
      } else if (transitioning && !prevTransitioningRef.current) {
        // When transitioning goes from false to true, load next photo on transitionend
        function listener() {
          loadNextPhoto();
          imageDiv.removeEventListener('transitionend', listener);
        }
        imageDiv.addEventListener('transitionend', listener);
        blockTransitionsForSomeTime();
      }
    }
    prevTransitioningRef.current = transitioning;
  }, [transitioning, loadNextPhoto]);

  // Subtle parallax effect so links stick out in front of busy photos
  useEffect(() => {
    if (linkAnchorRef.current != null) {
      const linkAnchor = linkAnchorRef.current;

      function handleParallax(e) {
        const xPercentage = e.clientX / window.innerWidth;
        const yPercentage = e.clientY / window.innerHeight;
        const anchorCenterX = (linkAnchor.offsetLeft + (linkAnchor.offsetWidth / 2))
          / window.innerWidth;
        const anchorCenterY = (linkAnchor.offsetTop + (linkAnchor.offsetHeight / 2))
          / window.innerHeight;
        const distanceX = xPercentage - anchorCenterX;
        const distanceY = yPercentage - anchorCenterY;
        linkAnchor.style.cssText = `transform: perspective(50px) rotateX(${
          -distanceY
        }deg) rotateY(${
          distanceX
        }deg)`;
      }

      document.addEventListener('mousemove', handleParallax);
      return () => {
        document.removeEventListener('mousemove', handleParallax);
      }
    }
  }, [])

  const resetScroll = (e) => {
    e.target.scrollTop = 0;
    e.target.scrollLeft = 0;
  };

  return (
    <div className={style9(styles.container)}>
      <div className={style9(styles.backgroundLayer)} onScroll={resetScroll}>
        <div
          aria-label={`Photo taken in ${photo.location}`}
          className={style9(
            styles.image,
            transitioning ? styles.imageTransitioningOut : styles.imageTransitioningIn,
            // previousPhoto == null && styles.imageInitial,
          )}
          role="img"
          ref={imageRef}
          style={{
            backgroundImage: `url(https://cdn.ankitsardesai.ca/backgrounds/${photo.name}.jpg)`,
          }}
        />

        <div className={style9(styles.imageFrame)}>
          <div className={style9(styles.linkAnchor)} ref={linkAnchorRef}>
            <button
              onClick={triggerNextPhoto}
              className={style9(
                styles.pill,
                styles.namePill,
              )}>
              <img
                aria-hidden="true"
                src="https://cdn.ankitsardesai.ca/assets/profile.jpg"
                className={style9(styles.nameAvatar)}
              />
              <h1 className={style9(styles.pillText, styles.nameHeading)}>Ankit Sardesai</h1>
            </button>
            <div className={style9(styles.linkPile)}>
              <a
                href="https://www.linkedin.com/in/amsardesai"
                target="_blank"
                style={{ animationDelay: '200ms' }}
                className={style9(styles.pill, styles.linkPill)}>
                <IconLinkedIn className={style9(styles.pillIcon)} />
                <span className={style9(styles.pillText)}>linkedin</span>
              </a>
              <a
                href="/resume"
                style={{ animationDelay: '400ms' }}
                className={style9(styles.pill, styles.linkPill)}>
                <IconBriefcase className={style9(styles.pillIcon)} />
                <span className={style9(styles.pillText)}>resume</span>
              </a>
              <a
                href="https://www.github.com/amsardesai"
                target="_blank"
                style={{ animationDelay: '600ms' }}
                className={style9(styles.pill, styles.linkPill)}>
                <IconGithub className={style9(styles.pillIcon)} />
                <span className={style9(styles.pillText)}>github</span>
              </a>
              <a
                href="mailto:me@ankitsardesai.ca"
                style={{ animationDelay: '800ms' }}
                className={style9(styles.pill, styles.linkPill)}>
                <IconMail className={style9(styles.pillIcon)} />
                <span className={style9(styles.pillText)}>email</span>
              </a>
            </div>
          </div>

          <a
            href={`https://google.com/maps/search/${photo.location}`}
            target="_blank"
            className={style9(
              styles.pill,
              styles.locationPill,
              transitioning
                ? styles.locationPillTransitioningOut
                : styles.locationPillTransitioningIn,
            )}>
            <IconLocation className={style9(styles.pillIcon)} />
            <div className={style9(styles.pillText)}>{photo.location}</div>
          </a>
        </div>
      </div>
    </div>
  );
}



