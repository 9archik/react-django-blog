import { useParams } from 'react-router-dom';
import styles from './style.module.scss';
import useFetch from '../../hooks/useFetch';
import { useRef, useContext, useState, useEffect } from 'react';
import { IUserLogin, UserContext } from '../../providers/UserContext';
import Comments from './Comments';
import NotFound from '../NotFound/NotFound';
import Loading from '../Loading/Loading';

export interface IPostID {
	title: string;
	image: string | null;
	content: string;
	theme: string;
	created_at: string;
}

export interface IPostCommentID {
	id: string;
	content: string;
	date: string;
	avatar: string | null;
	username: string;
}
const PostPage = () => {
	const { id } = useParams();

	const { data, loading, error, errorCode } = useFetch<IPostID>({
		url: `http://localhost/api/post/${id}/`,
	});

	if (errorCode === 404) {
		return <NotFound />;
	}

	if (loading) {
		return <Loading />;
	}

	return (
		<div className={`${styles.container} container`}>
			<div className={styles.content}>
				<div className={styles.postImageCont}>
					<img className={styles.postImage} src={data?.image ? data.image : undefined} />
				</div>

				<div className={styles.text}>{data?.content}</div>
				<Comments />
			</div>
		</div>
	);
};

export default PostPage;
