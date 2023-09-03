import React, {
	createContext,
	useState,
	useContext,
	FC,
	PropsWithChildren,
	useEffect,
} from 'react';

export interface IUserLogin {
	login: boolean;
	setLogin: React.Dispatch<React.SetStateAction<boolean>>;
}

export const UserContext = createContext<IUserLogin | null>(null);

export const UserProvider: FC<PropsWithChildren> = ({ children }) => {
	const [login, setLogin] = useState<boolean>(false);

	return <UserContext.Provider value={{login, setLogin}}>{children}</UserContext.Provider>;
};
