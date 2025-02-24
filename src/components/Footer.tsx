import { FiAlertCircle, FiHome, FiMail } from 'react-icons/fi';
import { Tooltip } from 'flowbite-react';
import './Footer.scss';

function Footer() {
    return (
        <footer className="footer">
            <div className="footer-content">
                <span className="footer-text">
                    2024 orime-Studio ©
                </span>
                <ul className="footer-icons">
                    <li className="icon-item">
                        <Tooltip content="Home" placement="top" className="tooltip">
                            <a href="/kampein" className="icon-link">
                                <FiHome size={20} />
                            </a>
                        </Tooltip>
                    </li>
                    <li className="icon-item">
                        <Tooltip content="About" placement="top" className="tooltip">
                            <a href="/about" className="icon-link">
                                <FiAlertCircle size={20} />
                            </a>
                        </Tooltip>
                    </li>
                    <li className="icon-item">
                        <Tooltip content="Contact" placement="top" className="tooltip">
                            <a href="mailto:chabadyaffo@gmail.com" className="icon-link">
                                <FiMail size={20} />
                            </a>

                        </Tooltip>
                    </li>
                </ul>
            </div>
        </footer>
    );
}

export default Footer;
