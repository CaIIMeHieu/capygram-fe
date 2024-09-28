// Comment.js
import './Comment.scss';
import avt from '../../assets/images/account.png';
import { useState, useEffect, useContext, useRef } from 'react';
import { Carousel } from 'antd';
import Options from './Options';
import ShareTo from '../explore/ShareTo';
import { motion } from 'framer-motion';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import EmojiPicker from 'emoji-picker-react';
import { getUserById } from '@/api/authApi/auth';
import { SuggestionsContext } from './SuggestionsContext';

const Comment = ({ post }) => {
    const [icons, setIcons] = useState(false);
    const [bookmark, setBookmark] = useState(false);
    const [showOptions, setShowOptions] = useState(false);
    const [showShare, setShowShare] = useState(false);
    const [showEmoji, setShowEmoji] = useState(false);
    const { comments, addComment, likes, toggleLike, userLikes } = useContext(SuggestionsContext);
    const [input, setInput] = useState('');
    const postComments = comments[post.id] || [];
    const [user, setUser] = useState({});
    const [isLiked, setIsLiked] = useState(false); // Cập nhật trạng thái thích
    const inputRef = useRef(null);
    const me = useSelector(state => state.user);
    const navigate = useNavigate();

    // Xử lý trạng thái thích
    useEffect(() => {
        const userId = localStorage.getItem('userId');
        const likedPosts = userLikes[userId] || [];
        setIsLiked(likedPosts.includes(post.id));
    }, [userLikes, post.id]);

    // Xử lý nút like
    const handleLikeToggle = () => {
        toggleLike(post.id);
    };

    const addEmoji = (event, emojiObject) => {
        const emoji = event.emoji;
        const { selectionStart, selectionEnd } = inputRef.current;
        const start = input.substring(0, selectionStart);
        const end = input.substring(selectionEnd, input.length);
        const updateInput = start + emoji + end;
        setInput(updateInput);
        inputRef.current.focus();
    };

    useEffect(() => {
        const getData = async () => {
            const res = await getUserById(post.userId);
            setUser(res.profile);
        };
        getData();
    }, [post.id]);

    const handleSend = () => {
        if (input.trim() !== '') {
            const newComment = {
                user: me,
                comment: input.trim(),
                postId: post.id,
            };
            addComment(post.id, newComment);
            setInput('');
        }
    };

    const handleClickProfileUser = (id) => {
        navigate(`/profile/${id}`);
    };

    return (
        <>
            <div className='comment-container'>
                <div className="comment-image">
                    <div className="i">
                        <Carousel arrows infinite={false}>
                            {post.imageUrls.map((imgSrc, imgId) => (
                                <div className="image-slider" key={imgId}>
                                    <img src={imgSrc} alt="" />
                                </div>
                            ))}
                        </Carousel>
                    </div>
                </div>
                <div className="comment-content">
                    <div className="comment-content-header">
                        <div className="comment-header-left">
                            <div className="comment-header-avt">
                                <img style={{ cursor: 'pointer' }} src={user.avatarUrl || avt} alt="" />
                            </div>
                        </div>
                        <div className="comment-header-right">
                            <div className="comment-header-username">
                                <p onClick={() => handleClickProfileUser(post.userId)}>{post.userName}</p>
                            </div>
                            <div className="comment-header-option">
                                <span>
                                    <i onClick={() => setShowOptions(true)} className="fa-solid fa-ellipsis"></i>
                                </span>
                            </div>
                        </div>
                    </div>
                    <div className="comment">
                        {postComments.map((comment, index) => (
                            <div className='comment-item' key={index}>
                                <div className='info-user-comment'>
                                    <img src={comment.user.avatarUrl || avt} alt='avatar-info-user-comment' />
                                </div>
                                <div className='content-comment'>
                                    <p><b>{comment.user.username}</b></p>
                                    <p>{comment.comment}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="comment-content-footer">
                        <div className="comment-group-bottom">
                            <div className="icons">
                                <div className="icons-left">
                                    <span>
                                        {isLiked ? (
                                            <i
                                                className="fa-solid fa-heart"
                                                style={{ color: '#f20d0d', scale: '1.1' }}
                                                onClick={handleLikeToggle}
                                            ></i>
                                        ) : (
                                            <i
                                                className="fa-regular fa-heart"
                                                onClick={handleLikeToggle}
                                            ></i>
                                        )}
                                    </span>
                                    <span>
                                        <i className="fa-regular fa-comment"></i>
                                    </span>
                                    <span>
                                        <i className="fa-regular fa-paper-plane" onClick={() => setShowShare(true)}></i>
                                    </span>
                                </div>
                                <div className="icons-right">
                                    <span>
                                        {!bookmark ? (
                                            <i className="fa-regular fa-bookmark" onClick={() => setBookmark(!bookmark)}></i>
                                        ) : (
                                            <i className="fa-solid fa-bookmark" onClick={() => setBookmark(!bookmark)}></i>
                                        )}
                                    </span>
                                </div>
                            </div>
                            <div className="comment-likes">
                                <p>{post.content}</p>
                                <p><span>{Object.keys(likes).filter(id => id === post.id).length}</span> lượt thích</p>
                            </div>
                            <p style={{ fontSize: '14px', color: 'gray' }} className="comment-caption-time">
                                <span>{post.day}</span> ngày trước
                            </p>
                        </div>
                        <div className="comment-post">
                            <form>
                                <span style={{ position: 'relative' }}>
                                    <i className="fa-regular fa-face-smile" onClick={() => setShowEmoji(!showEmoji)}></i>
                                    {showEmoji && (
                                        <EmojiPicker onEmojiClick={addEmoji} className='emoj' />
                                    )}
                                </span>
                                <input
                                    type="text"
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    onClick={() => setShowEmoji(false)}
                                    ref={inputRef}
                                    placeholder="Thêm bình luận..."
                                />
                                <p className="btn-post-comment" onClick={handleSend}>Đăng</p>
                            </form>
                        </div>
                    </div>
                </div>
                {showOptions && (
                    <div className='overlay' onClick={() => setShowOptions(false)}>
                        <motion.div
                            className='note-container'
                            onClick={(e) => e.stopPropagation()}
                            animate={{ opacity: 1, scale: 1 }}
                            initial={{ opacity: 0, scale: 0.5 }}
                            transition={{ duration: 0.3 }}
                        >
                            <Options oncancel={() => setShowOptions(false)} />
                        </motion.div>
                    </div>
                )}
                {showShare && (
                    <div className='overlay' onClick={() => setShowShare(false)}>
                        <motion.div
                            className='note-container'
                            onClick={(e) => e.stopPropagation()}
                            animate={{ opacity: 1, scale: 1 }}
                            initial={{ opacity: 0, scale: 0.5 }}
                            transition={{ duration: 0.3 }}
                        >
                            <ShareTo />
                        </motion.div>
                    </div>
                )}
            </div>
        </>
    );
};

export default Comment;
