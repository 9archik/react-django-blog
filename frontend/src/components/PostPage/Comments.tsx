import { useParams } from 'react-router-dom';
import useFetch from '../../hooks/useFetch';
import { IPostCommentID } from './PostPage';
import { useContext, useEffect, useRef, useState } from 'react';
import styles from './style.module.scss';
import { IUserLogin, UserContext } from '../../providers/UserContext';
import avatar from '../../assets/images/avatar.jpg';

const Months = ['Jan', 'Feb', 'Maк', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const Comments = () => {
	const { id } = useParams();
	const [comment, setComment] = useState<string>('');
	const [errorLogin, setErrorLogin] = useState<boolean>(false);
	const textareaRef = useRef<HTMLTextAreaElement>(null);
	const firstRender = useRef<boolean>(false);
	const { login } = useContext(UserContext) as IUserLogin;

	const {
		data: commentsData,
		loading: commentLoading,
		error: commentError,
		fetchNow: fetchComments,
	} = useFetch<IPostCommentID[]>({
		url: `http://9archikblog.ru/api/comments/${id}/`,
		enabled: false,
	});

	const { data, fetchNow } = useFetch({
		url: `http://9archikblog.ru/api/comments/${id}/`,
		enabled: false,
		options: {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({ content: comment }),
			credentials: 'include',
		},
	});

	useEffect(() => {
		if (firstRender.current && login) {
			setErrorLogin(false);
		}
	}, [login]);

	useEffect(() => {
		fetchComments();
	}, [data]);

	const convertToDate = (str: string) => {
		const date = new Date(str);
		return `${date.getDate()} ${Months[date.getMonth()]} ${date.getFullYear()}`;
	};
	return (
		<>
			<div className={styles.comments}>
				<div className={styles.header}>
					<h5>Comments</h5>
					{errorLogin && <span className={styles.error}>Log in account for comment</span>}
				</div>

				<div className={styles.inputWrapper}>
					<textarea
						ref={textareaRef}
						value={comment}
						onChange={(e) => {
							setComment(e.target.value);
						}}
						className={styles.textField}
						placeholder="Write comment"
					/>
				</div>
				<div className={styles.buttonContainer}>
					<button
						onClick={() => {
							if (
								login &&
								textareaRef?.current?.value?.length &&
								textareaRef?.current?.value?.length > 0
							) {
								fetchNow();
								setComment('');
							} else {
								if (!login) {
									setErrorLogin(true);
								}
							}
						}}>
						Publish
					</button>
				</div>
				<ul>
					{commentsData?.map((el) => {
						return (
							<li>
								<div className={styles.info}>
									<img
										src={el.avatar ? el.avatar : avatar}
										className={styles.avatar}
										width="44"
										height={44}
									/>
									<div className={styles.infoText}>
										<span className={styles.nickname}>{el.username}</span>
										<span className={styles.date}>{convertToDate(el.date)}</span>
									</div>
								</div>
								<div className={styles.text}>{el.content}</div>
							</li>
						);
					})}
				</ul>
			</div>
		</>
	);
};

export default Comments;
