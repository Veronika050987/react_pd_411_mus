import './Footer.css';

function Footer()
{
    return(
        <div className="footer">
            Copyright &copy; &mdash; {new Date().getFullYear()};
        </div>
    )
}
export default Footer;