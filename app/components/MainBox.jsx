
import FontAwesome from 'react-fontawesome';
import React from 'react';
import Tooltip from 'rc-tooltip';

export default function MainBox() {
  return (
    <section className="main__top-section">
      <div className="main__center-container">
        <div className="main__box">
          <h3 className="main__box-heading">Ankit Sardesai</h3>
          <h6 className="main__box-subheading"><em>software</em> developer</h6>
          <h6 className="main__box-subheading"><em>travelling</em> addict</h6>
          <h6 className="main__box-subheading">amateur <em>photographer</em></h6>
          <div className="main__box-icons">

            <Tooltip placement="bottom" overlay={(
              <span><strong>Instagram</strong><br />@amsardesai</span>
            )}>
            <a href="https://www.instagram.com/amsardesai/"><FontAwesome name="instagram" /></a>
            </Tooltip>

            <Tooltip placement="bottom" overlay={(
              <span><strong>500px</strong><br />@amsardesai</span>
            )}>
            <a href="https://500px.com/amsardesai"><FontAwesome name="500px" /></a>
            </Tooltip>

            <Tooltip placement="bottom" overlay={(
              <span><strong>My Resume</strong><br />Click to view</span>
            )}>
            <a href="/resume"><FontAwesome name="file-pdf-o" /></a>
            </Tooltip>

            <Tooltip placement="bottom" overlay={(
              <span><strong>Email</strong><br />me at ankitsardesai dot ca</span>
            )}>
            <a href="mailto:me@ankitsardesai.ca"><FontAwesome name="envelope" /></a>
            </Tooltip>

            <Tooltip placement="bottom" overlay={(
              <span><strong>GitHub</strong><br />@amsardesai</span>
            )}>
            <a href="https://github.com/amsardesai"><FontAwesome name="github-alt" /></a>
            </Tooltip>

            <Tooltip placement="bottom" overlay={(
              <span><strong>LinkedIn</strong><br />Ankit Sardesai</span>
            )}>
            <a href="https://www.linkedin.com/in/amsardesai"><FontAwesome name="linkedin" /></a>
            </Tooltip>

          </div>
        </div>
      </div>
    </section>
  );
}
