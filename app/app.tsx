import * as React from 'react';
import { useCallback, useEffect, useLayoutEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import style9 from 'style9';

import IconBriefcase from './icons/IconBriefcase.js';
import IconGithub from './icons/IconGithub.js';
import IconLinkedIn from './icons/IconLinkedIn.js';
import IconLocation from './icons/IconLocation.js';
import IconMail from './icons/IconMail.js';
import type { Photo } from './reducer.js';
import type { State } from './reducer.js';

const styles = style9.create({
  backgroundLayer: {
    alignItems: 'center',
    bottom: 0,
    display: 'flex',
    justifyContent: 'center',
    left: 0,
    overflow: 'hidden',
    position: 'absolute',
    right: 0,
    top: 0,
  },
  container: {
    backgroundColor: '#000',
    height: '100vh',
    position: 'relative',
  },
  image: {
    backgroundPositionX: 'center',
    backgroundPositionY: 'center',
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'contain',
    height: '100%',
    transformOrigin: 'center center',
    transitionDuration: '1s',
    transitionProperty: 'opacity',
    transitionTimingFunction: 'ease-in-out',
    width: '100%',
    willChange: 'opacity',
  },
  imageFrame: {
    alignItems: 'center',
    boxSizing: 'border-box',
    display: 'flex',
    flexDirection: 'column',
    height: '100vh',
    maxWidth: 'calc(100vh * 1.575)',
    paddingBottom: '1em',
    paddingLeft: '1em',
    paddingRight: '1em',
    paddingTop: 'calc(max(1.5em, 4%))',
    position: 'relative',
    width: '100%',
  },
  imageLayer: {
    display: 'flex',
    height: 'calc(100vh * 1.05)',
    left: 0,
    marginLeft: 'calc(100% * -0.1)',
    marginTop: 'calc(100vh * -0.025)',
    position: 'absolute',
    top: 0,
    transformOrigin: 'center center',
    transitionDuration: '100ms',
    transitionProperty: 'transform',
    transitionTimingFunction: 'linear',
    userSelect: 'none',
    width: 'calc(100% * 1.2)',
    willChange: 'transform',
  },
  imagePreloader: {
    height: 1,
    opacity: 0,
    width: 1,
  },
  imageTransitioningIn: {
    opacity: 1,
  },
  imageTransitioningOut: {
    opacity: 0,
  },
  linkAnchor: {
    alignItems: 'center',
    display: 'flex',
    flexDirection: 'column',
    transitionDuration: '100ms',
    transitionProperty: 'transform',
    transitionTimingFunction: 'linear',
    willChange: 'transform',
  },
  linkPile: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginLeft: '1em',
    marginRight: '1em',
    marginTop: '0.6em',
  },
  linkPill: {
    animationDuration: '1s',
    animationName: style9.keyframes({
      '0%': { opacity: 0, transform: 'translateX(-20px)' },
      '100%': { opacity: 1, transform: 'translateX(0)' },
    }),
    marginBottom: '0.45em',
    marginLeft: '0.25em',
    marginRight: '0.25em',
  },
  locationPill: {
    ':after': {
      borderBottom: '0.4em solid rgba(255,255,255,1)',
      borderLeft: '0.4em solid transparent',
      borderRight: '0.4em solid transparent',
      content: '""',
      height: 0,
      left: '1em',
      opacity: 0.85,
      position: 'absolute',
      top: '-0.5em',
      transitionDuration: '200ms',
      transitionProperty: 'opacity',
      transitionTimingFunction: 'ease-out',
      width: 0,
      willChange: 'opacity',
    },
    // Only way to do cascading using style9
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    ':focus-visible:after': {
      opacity: 1,
      transitionDuration: '50ms',
    },
    ':hover:after': {
      opacity: 1,
      transitionDelay: '100ms',
      transitionDuration: '50ms',
    },
    bottom: '1em',
    position: 'absolute',
    right: '1em',
    transitionDuration: '500ms',
    transitionProperty: 'transform, opacity',
    transitionTimingFunction: 'ease-in-out',
    willChange: 'transform, opacity',
  },
  locationPillInitial: {
    transitionDuration: '0s',
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
  nameAvatar: {
    borderRadius: '50%',
    height: '3em',
    width: '3em',
  },
  nameHeading: {
    fontSize: '2em',
    fontWeight: '500',
    margin: 0,
    marginBottom: -2,
    paddingRight: '0.4em',
  },
  namePill: {
    animationDuration: '1s',
    animationName: style9.keyframes({
      '0%': { opacity: 0, transform: 'translateY(30px)' },
      '100%': { opacity: 1, transform: 'translateY(0)' },
    }),
    backgroundColor: '#fff',
    boxShadow: '0 0.1em 10px rgba(0,0,0,0.35)',
    cursor: 'pointer',
    padding: '0.3em',
  },
  pill: {
    ':before': {
      backgroundColor: 'rgb(255,255,255)',
      borderRadius: '3em',
      bottom: '-0.15em',
      boxShadow: '0 0.1em 10px rgba(0,0,0,0.35)',
      content: '""',
      left: '-0.15em',
      opacity: 0,
      position: 'absolute',
      right: '-0.15em',
      top: '-0.15em',
      transitionDuration: '300ms',
      transitionProperty: 'opacity',
      transitionTimingFunction: 'ease-out',
      willChange: 'opacity',
      zIndex: -1,
    },
    // Only way to do cascading using style9
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    ':focus-visible:before': {
      opacity: 1,
      transitionDuration: '50ms',
    },
    ':hover:before': {
      opacity: 1,
      transitionDelay: '100ms',
      transitionDuration: '50ms',
    },
    WebkitBackdropFilter:
      'brightness(80%) invert(10%) saturate(250%) blur(30px)',
    alignItems: 'center',
    animationFillMode: 'both',
    backdropFilter: 'brightness(80%) invert(10%) saturate(250%) blur(30px)',
    borderColor: 'rgba(255,255,255,0.85)',
    borderRadius: '3em',
    borderStyle: 'solid',
    borderWidth: '0.15em',
    boxSizing: 'border-box',
    color: 'rgba(0,0,0,0.9)',
    display: 'flex',
    fontFamily: 'inherit',
    isolation: 'isolate',
    padding: '0.6em',
    position: 'relative',
    textDecoration: 'none',
    transitionDuration: '2s',
    transitionProperty: 'transform, opacity',
    transitionTimingFunction: 'ease-in-out',
    willChange: 'transform, opacity',
  },
  pillIcon: {
    color: 'white',
    fill: 'white',
    height: '1em',
    mixBlendMode: 'difference',
    pointerEvents: 'none',
    width: '1em',
  },
  pillText: {
    color: 'white',
    fontWeight: '400',
    marginBottom: -2,
    mixBlendMode: 'difference',
    paddingLeft: '0.3em',
    paddingRight: '0.1em',
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

export default function App(): JSX.Element {
  const dispatch = useDispatch();
  const previousPhoto = useSelector<State, State['previousPhoto']>(
    state => state.previousPhoto,
  );
  const currentPhotoFromState = useSelector<State, State['currentPhoto']>(
    state => state.currentPhoto,
  );
  const transitioning = useSelector<State, State['transitioning']>(
    state => state.transitioning,
  );

  const currentPhoto =
    transitioning && previousPhoto != null
      ? previousPhoto
      : currentPhotoFromState;

  const imageRef = useRef<HTMLDivElement | null>(null);
  const imageLayerRef = useRef<HTMLDivElement | null>(null);
  const linkAnchorRef = useRef<HTMLDivElement | null>(null);

  // Preload the image using dummy element
  const preloadImage = useCallback((nextImage: Photo) => {
    return new Promise<Photo>((resolve, reject) => {
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
          resolve(nextImage);
        };
        imageElement.onerror = e => {
          reject(e);
        };
        imageDiv.replaceChildren(imageElement);
      }
    });
  }, []);

  const transitionBlockingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const carouselTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const preloadedImageRef = useRef<Photo | null>(null);

  const blockTransitionsForSomeTime = useCallback(() => {
    clearTimeout(Number(transitionBlockingTimeoutRef.current));
    transitionBlockingTimeoutRef.current = setTimeout(() => {
      transitionBlockingTimeoutRef.current = null;
    }, MIN_TIME_PER_PHOTO);
  }, []);

  // Trigger the next photo if past transition period and next image is preloaded
  const triggerNextPhoto = useCallback(() => {
    const preloadedImage = preloadedImageRef.current;
    if (
      preloadedImage != null &&
      transitionBlockingTimeoutRef.current == null
    ) {
      clearTimeout(Number(carouselTimeoutRef.current));
      carouselTimeoutRef.current = null;
      dispatch({ type: 'PUSH_NEXT_PHOTO', ...preloadedImage });
    }
  }, [dispatch]);

  // Finish transition for current photo, preload the next photo, and push it in after timer
  const loadNextPhoto = useCallback(
    (previousPhoto: Photo) => {
      // Start fading in the image
      dispatch({ type: 'SHOW_PHOTO' });

      // Push next photo after timer finishes AND next image is preloaded
      carouselTimeoutRef.current = setTimeout(() => {
        carouselTimeoutRef.current = null;
        triggerNextPhoto();
      }, CAROUSEL_DELAY);

      fetch(`/api/getNextPhoto/${previousPhoto.name}`)
        .then(response => response.json())
        .then(nextImage => preloadImage(nextImage))
        .then(nextImage => {
          preloadedImageRef.current = nextImage;
          if (carouselTimeoutRef.current == null) {
            triggerNextPhoto();
          }
        });
    },
    [dispatch, preloadImage, triggerNextPhoto],
  );

  // Preload image when this component mounts, then start carousel
  const hasStartedRef = useRef(false);
  useEffect(() => {
    if (hasStartedRef.current === false && currentPhoto != null) {
      preloadImage(currentPhoto).then(loadNextPhoto);
      blockTransitionsForSomeTime();
      hasStartedRef.current = true;
    }
  });

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
        const startTransform = `scale(${
          shouldZoomIn ? 1.15 : 1.3
        }) translate(${initialX}%, ${initialY}%)`;
        const endTransform = `scale(${
          shouldZoomIn ? 1.3 : 1.15
        }) translate(${finalX}%, ${finalY}%)`;

        imageDiv.animate(
          [{ transform: startTransform }, { transform: endTransform }],
          { duration: CAROUSEL_DELAY + MIN_TIME_PER_PHOTO, iterations: 1 },
        );
        imageDiv.style.setProperty('transform', endTransform);
      } else if (transitioning && !prevTransitioningRef.current) {
        // When transitioning goes from false to true, load next photo on transitionend
        function listener() {
          if (currentPhoto != null) {
            loadNextPhoto(currentPhoto);
          }
          if (imageDiv != null) {
            imageDiv.removeEventListener('transitionend', listener);
          }
        }
        imageDiv.addEventListener('transitionend', listener);
        blockTransitionsForSomeTime();
      }
    }
    prevTransitioningRef.current = transitioning;
  }, [transitioning, loadNextPhoto, blockTransitionsForSomeTime, currentPhoto]);

  // Subtle parallax effect so links stick out in front of busy photos
  useEffect(() => {
    const linkAnchor = linkAnchorRef.current;
    const imageLayer = imageLayerRef.current;
    if (linkAnchor != null && imageLayer != null) {
      function handleParallax(e: MouseEvent) {
        if (linkAnchor == null || imageLayer == null) {
          return;
        }

        const xPercentage = e.clientX / window.innerWidth;
        const yPercentage = e.clientY / window.innerHeight;

        const linkAnchorCenterX =
          (linkAnchor.offsetLeft + linkAnchor.offsetWidth / 2) /
          window.innerWidth;
        const linkAnchorCenterY =
          (linkAnchor.offsetTop + linkAnchor.offsetHeight / 2) /
          window.innerHeight;
        const linkAnchorDistanceX = xPercentage - linkAnchorCenterX;
        const linkAnchorDistanceY = yPercentage - linkAnchorCenterY;

        const imageLayerCenterX =
          (imageLayer.offsetLeft + imageLayer.offsetWidth / 2) /
          window.innerWidth;
        const imageLayerCenterY =
          (imageLayer.offsetTop + imageLayer.offsetHeight / 2) /
          window.innerHeight;
        const imageLayerDistanceX = xPercentage - imageLayerCenterX;
        const imageLayerDistanceY = yPercentage - imageLayerCenterY;

        linkAnchor.style.cssText = `transform: perspective(50px) rotateX(${
          -linkAnchorDistanceY * 3
        }deg) rotateY(${linkAnchorDistanceX}deg)`;
        imageLayer.style.cssText = `transform: perspective(2000px) rotateX(${-imageLayerDistanceY}deg) rotateY(${imageLayerDistanceX}deg)`;
      }

      document.addEventListener('mousemove', handleParallax);
      return () => {
        document.removeEventListener('mousemove', handleParallax);
      };
    }
  }, []);

  // Trigger next photo when pressing right arrow key
  useEffect(() => {
    function handleKeyPress(e: KeyboardEvent) {
      if (e.key === 'ArrowRight') {
        triggerNextPhoto();
      }
    }
    document.addEventListener('keydown', handleKeyPress);
    return () => {
      document.removeEventListener('keydown', handleKeyPress);
    };
  }, [triggerNextPhoto]);

  const resetScroll = (e: React.SyntheticEvent<HTMLDivElement, UIEvent>) => {
    const target = e.target;
    if (target instanceof Element) {
      target.scrollTop = 0;
      target.scrollLeft = 0;
    }
  };

  return (
    <div className={style9(styles.container)}>
      <div className={style9(styles.backgroundLayer)} onScroll={resetScroll}>
        <div className={style9(styles.imageLayer)} ref={imageLayerRef}>
          {currentPhoto != null && (
            <div
              aria-label={`Photo taken in ${currentPhoto.location}`}
              className={style9(
                styles.image,
                transitioning
                  ? styles.imageTransitioningOut
                  : styles.imageTransitioningIn,
                // previousPhoto == null && styles.imageInitial,
              )}
              ref={imageRef}
              role="img"
              style={{
                backgroundImage: `url(https://cdn.ankitsardesai.ca/backgrounds/${currentPhoto.name}.jpg)`,
              }}
            />
          )}
        </div>

        <div className={style9(styles.imageFrame)}>
          <div className={style9(styles.linkAnchor)} ref={linkAnchorRef}>
            <button
              className={style9(styles.pill, styles.namePill)}
              onClick={triggerNextPhoto}
            >
              <img
                aria-hidden="true"
                className={style9(styles.nameAvatar)}
                src="https://cdn.ankitsardesai.ca/assets/profile.jpg"
              />
              <h1 className={style9(styles.pillText, styles.nameHeading)}>
                Ankit Sardesai
              </h1>
            </button>
            <div className={style9(styles.linkPile)}>
              <a
                className={style9(styles.pill, styles.linkPill)}
                href="https://www.linkedin.com/in/amsardesai"
                rel="noreferrer"
                style={{ animationDelay: '200ms' }}
                target="_blank"
              >
                <IconLinkedIn className={style9(styles.pillIcon)} />
                <span className={style9(styles.pillText)}>linkedin</span>
              </a>
              <a
                className={style9(styles.pill, styles.linkPill)}
                href="/resume.pdf"
                style={{ animationDelay: '400ms' }}
              >
                <IconBriefcase className={style9(styles.pillIcon)} />
                <span className={style9(styles.pillText)}>resume</span>
              </a>
              <a
                className={style9(styles.pill, styles.linkPill)}
                href="https://www.github.com/amsardesai"
                rel="noreferrer"
                style={{ animationDelay: '600ms' }}
                target="_blank"
              >
                <IconGithub className={style9(styles.pillIcon)} />
                <span className={style9(styles.pillText)}>github</span>
              </a>
              <a
                className={style9(styles.pill, styles.linkPill)}
                href="mailto:amsardesai@gmail.com"
                style={{ animationDelay: '800ms' }}
              >
                <IconMail className={style9(styles.pillIcon)} />
                <span className={style9(styles.pillText)}>email</span>
              </a>
            </div>
          </div>

          {currentPhoto != null && (
            <a
              className={style9(
                styles.pill,
                styles.locationPill,
                transitioning
                  ? styles.locationPillTransitioningOut
                  : styles.locationPillTransitioningIn,
                transitioning &&
                  previousPhoto == null &&
                  styles.locationPillInitial,
              )}
              href={`https://google.com/maps/search/${currentPhoto.location}`}
              rel="noreferrer"
              target="_blank"
            >
              <IconLocation className={style9(styles.pillIcon)} />
              <div className={style9(styles.pillText)}>
                {currentPhoto.location}
              </div>
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
