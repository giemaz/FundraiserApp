import './Avatar.css';

const Avatar = ({ username, image, className, style, alt, width }) => {
	return (
		<div className='avatar-wrapper'>
			<div className='username'>{username}</div>
			<div className={`avatar ${className}`} style={style}>
				<img src={`http://localhost:3003/${image}`} alt={alt} style={{ width: width, height: width }} />
			</div>
		</div>
	);
};

export default Avatar;
