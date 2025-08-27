import { FiAlertCircle, FiHome, FiMail } from 'react-icons/fi';
import { FaWhatsapp } from 'react-icons/fa';
import { Tooltip } from 'flowbite-react';
import './Footer.scss';

function Footer() {
    return (
        <footer className="footer">
            <div className="footer-content">
                <span className="footer-text">
                    2025 Tamar Tamam ©
                </span>
                <ul className="footer-icons">
                    <li className="icon-item">
                        <Tooltip content="Home" placement="top" className="tooltip">
                            <a href="#" className="icon-link" aria-label="Home">
                                <FiHome size={20} />
                            </a>
                        </Tooltip>
                    </li>
                    <li className="icon-item">
                        <Tooltip content="About" placement="top" className="tooltip">
                            <a href="/about" className="icon-link" aria-label="About">
                                <FiAlertCircle size={20} />
                            </a>
                        </Tooltip>
                    </li>
                    <li className="icon-item">
                        <Tooltip content="Contact" placement="top" className="tooltip">
                            <a href="mailto:lchabadyaffo@gmail.com" className="icon-link" aria-label="Contact">
                                <FiMail size={20} />
                            </a>
                        </Tooltip>
                    </li>
                    <li className="icon-item">
                        <Tooltip content="WhatsApp" placement="top" className="tooltip">
                            <a
                                href="https://wa.me/972537700339"
                                className="icon-link"
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label="WhatsApp"
                            >
                                <FaWhatsapp size={20} />
                            </a>
                        </Tooltip>
                    </li>
                </ul>
            </div>
        </footer>
    );
}

export default Footer;