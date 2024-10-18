import logo from "./logo.jpg";
import Image from "next/image";
import Styles from "./navbar.css";

export default function navbar() {
return (
    <nav>
          <Image src={logo}         
   alt="logo"
          width={180}
          height={38}
          priority/>
    </nav>
);
}
