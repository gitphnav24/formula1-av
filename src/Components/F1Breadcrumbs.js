import { Link } from "react-router-dom";

const F1Breadcrumbs = ({ items }) => {

    return <div>
        <ul> {items?.map((crumb, i) => {
            return (
                <li className="crumb" key={i}>
                    {(i === 0) ? (<Link className="crumb-btn" to={crumb.path}><img src={require("../img/icons/home-white.png")} style={{ maxWidth: 15, paddingRight: 5}} alt="home icon"/>{crumb.name}</Link>) : (<Link className="crumb-btn" to={crumb.path}>{crumb.name}</Link>)}
                </li>
            );
        })}
        </ul>
    </div>

}

export default F1Breadcrumbs;