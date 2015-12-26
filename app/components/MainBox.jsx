
import FontAwesome from 'react-fontawesome';
import React from 'react';
import Tooltip from 'rc-tooltip';

function createAnalyticsEventSender(service) {
  return function sendAnalyticsEvent() {
    if (!window || !window.ga) return;
    window.ga('send', 'event', 'button', 'click', service);
  };
}

export default function MainBox() {
  const tooltipProps = {
    placement: 'bottom',
    mouseLeaveDelay: 0,
  };

  return (
    <section className="main__top-section">
      <div className="main__center-container">
        <div className="main__box">
          <h3 className="main__box-heading">Ankit Sardesai</h3>
          <h6 className="main__box-subheading"><em>software</em> developer</h6>
          <h6 className="main__box-subheading"><em>travelling</em> addict</h6>
          <h6 className="main__box-subheading">amateur <em>photographer</em></h6>
          <div className="main__box-icons">

            <Tooltip {...tooltipProps}
              overlay={<span><strong>Instagram</strong><br />@amsardesai</span>}
            >
            <a href="https://www.instagram.com/amsardesai/"
              onClick={createAnalyticsEventSender('Instagram')}
            >
              <FontAwesome name="instagram" />
            </a>
            </Tooltip>

            <Tooltip {...tooltipProps}
              overlay={<span><strong>500px</strong><br />@amsardesai</span>}
            >
            <a href="https://500px.com/amsardesai"
              onClick={createAnalyticsEventSender('500px')}
            >
              <FontAwesome name="500px" />
            </a>
            </Tooltip>

            <Tooltip {...tooltipProps}
              overlay={<span><strong>My Resume</strong><br />Click to view</span>}
            >
            <a href="/resume/"
              onClick={createAnalyticsEventSender('Resume')}
            >
              <FontAwesome name="file-pdf-o" />
            </a>
            </Tooltip>

            <Tooltip {...tooltipProps}
              overlay={<span><strong>Email</strong><br />me at ankitsardesai dot ca</span>}
            >
            <a href="mailto:me@ankitsardesai.ca"
              onClick={createAnalyticsEventSender('Email')}
            >
              <FontAwesome name="envelope" />
            </a>
            </Tooltip>

            <Tooltip {...tooltipProps}
              overlay={<span><strong>GitHub</strong><br />@amsardesai</span>}
            >
            <a href="https://github.com/amsardesai"
              onClick={createAnalyticsEventSender('GitHub')}
            >
              <FontAwesome name="github-alt" />
            </a>
            </Tooltip>

            <Tooltip {...tooltipProps}
              overlay={<span><strong>LinkedIn</strong><br />Ankit Sardesai</span>}
            >
            <a href="https://www.linkedin.com/in/amsardesai"
              onClick={createAnalyticsEventSender('LinkedIn')}
            >
              <FontAwesome name="linkedin" />
            </a>
            </Tooltip>

          </div>
        </div>
      </div>
    </section>
  );
}
