function Footer() {
    return (
        <footer className="footer sm:footer-horizontal footer-center bg-white text-base-content p-4">
            <aside>
                <p>Copyright © {new Date().getFullYear()}</p>
            </aside>
        </footer>
    );
}

export default Footer;
