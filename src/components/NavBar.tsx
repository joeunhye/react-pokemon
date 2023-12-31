import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { styled } from "styled-components";
import { User, GoogleAuthProvider, getAuth, signInWithPopup, onAuthStateChanged, signOut } from "firebase/auth";
import app from "../firebase";
import storage from "../utils/storage";

const initialUserData = storage.get<User>('userData')

const NavBar = () => {
	const auth = getAuth(app);
	const provider = new GoogleAuthProvider();
	const [show, setShow] = useState(false);
	const { pathname } = useLocation();
	const navigate = useNavigate();
	const [userData, setUserData] = useState<User | null>(initialUserData);

	const handleAuth = () => {
		signInWithPopup(auth, provider)
			.then(result => {
				console.log(result);
				setUserData(result.user);
				storage.set("userData", result.user)
			})
			.catch(error => {
				console.error(error);
			});
	};

	const listner = () => {
		if (window.scrollY > 50) {
			setShow(true);
		} else {
			setShow(false);
		}
	};

	const handleLogout = () => {
		signOut(auth)
			.then(() => {
				storage.remove('userData')
				setUserData(null);
			})
			.catch(err => {
				alert(err.message);
			});
	};

	useEffect(() => {
		const unsubscribe = onAuthStateChanged(auth, user => {
			if (!user) {
				navigate("/login");
			} else if (user && pathname === "/login") {
				navigate("/");
			}
		});

		return () => {
			unsubscribe();
		};
	}, [pathname]);

	useEffect(() => {
		window.addEventListener("scroll", listner);
		return () => {
			window.removeEventListener("scroll", listner);
		};
	}, []);

	return (
		<NavWrapper $show={show}>
			<Logo>
				<Image src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/25.png" alt="poke logo" onClick={() => (window.location.href = "/")} />
			</Logo>
			{pathname === "/login" ? (
				<Login onClick={handleAuth}>로그인</Login>
			) : (
				<SignOut>
					{userData?.photoURL && (

					<UserImg src={userData.photoURL} />
					)}
					<Dropdown>
						<span onClick={handleLogout}>Sign Out</span>
					</Dropdown>
				</SignOut>
			)}
		</NavWrapper>
	);
};

const UserImg = styled.img`
	border-radius: 50%;
	width: 100%;
	height: 100%;
`;

const Dropdown = styled.div`
	position: absolute;
	top: 48px;
	right: 0px;
	background: rgba(19, 19, 19);
	border: 1px solid rgba(151, 151, 151, 0.34);
	border-radius: 5px;
	box-shadow: rgba(0, 0, 0, 0.5) 0 0 18px 0;
	padding: 10px;
	font-size: 15px;
	letter-spacing: 3px;
	width: 100px;
	opacity: 0;
	color: #fff;
`;

const SignOut = styled.div`
	position: relative;
	height: 48px;
	width: 48px;
	display: flex;
	cursor: pointer;
	align-items: center;
	justify-content: center;

	&:hover {
		${Dropdown} {
			opacity: 1;
			transition-duration: 0.5s;
		}
	}
`;

const Login = styled.a`
	background-color: rgba(0, 0, 0, 0.6);
	padding: 8px 16px;
	text-transform: uppercase;
	letter-spacing: 1.55px;
	border: 1px solid #f9f9f9;
	border-radius: 4px;
	transition: all 0.2s ease 0s;
	color: #fff;

	&:hover {
		background-color: #f9f9f9;
		color: #000;
		border-color: transparent;
	}
`;

const Image = styled.img`
	cursor: pointer;
	width: 100%;
`;

const Logo = styled.a`
	padding: 0;
	width: 50px;
	margin-top: 4px;
`;

const NavWrapper = styled.nav<{ $show: boolean }>`
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
	height: 70px;
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 0 36px;
	letter-spacing: 16px;
	z-index: 100;
	background-color: ${(props: { $show: boolean }) => (props.$show ? "#090b13" : "transparent")};
`;

export default NavBar;
