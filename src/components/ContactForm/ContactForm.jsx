import "./ContactForm.css";

import { MdOutlineArrowOutward } from "react-icons/md";

const ContactForm = () => {
  return (
    <section className="contact-form">
      <div className="contact-parallax-image-wrapper">
        <h1>OhMyDress</h1>
        <img
          src="https://ohmydress.store/cdn/shop/files/IMG_2827.jpg?v=1765537119&width=1600"
          alt=""
        />
      </div>
      <div className="contact-form-container">
        <div className="cf-header">
          <h4>Be the first to know.</h4>
        </div>
        <div className="cf-copy">
          <p className="bodyCopy sm">
            Sign up to receive early access to new releases, private drops and
            exclusive offers.
          </p>
        </div>
        <div className="cf-input">
          <input type="email" placeholder="Enter your email" />
        </div>
        <div className="cf-submit">
          <MdOutlineArrowOutward />
        </div>
        <div className="cf-footer">
          <div className="cf-divider"></div>
          <div className="cf-footer-copy">
            <p className="bodyCopy sm">
              No spam. Just rare, beautifully crafted updates.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactForm;
