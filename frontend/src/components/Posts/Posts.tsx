import { useNavigate } from 'react-router-dom';
import useFetch from '../../hooks/useFetch';
import styles from './style.module.scss';
import Loading from '../Loading/Loading';

export interface IPost {
	image: string | null;
	theme: string;
	title: string;
	id: number;
}

interface IPostList {
	posts: IPost[];
}

const Posts = () => {
	const { data, loading, error, errorCode } = useFetch<IPostList>({
		url: 'http://localhost/api/posts/',
	});

	const navigate = useNavigate();

	if (loading) {
		return <Loading />;
	}
	return (
		<div className={`${styles.container} container`}>
			<h2>Posts</h2>
			<ul>
				{data &&
					data.posts.map((el) => {
						return (
							<li onClick={() => navigate(`post/${el.id}`)}>
								<img src={el.image ? el.image : undefined} alt="post image" />
								<h3>{el.theme}</h3>
								<h4 className={styles.text}>{el.title}</h4>
							</li>
						);
					})}
			</ul>
		</div>
	);
};

export default Posts;
