/* eslint-disable */
import './Post.scss'
import avt from '../../assets/images/account.png'
import { useContext, useEffect, useState } from 'react'
import { motion } from 'framer-motion';
import { Carousel } from 'antd';
import Options from './Options'
import Comment from './Comment';
import { useDispatch, useSelector } from 'react-redux';
import EmojiPicker from 'emoji-picker-react';
import { newsFeed } from '@/api/authApi/newsfeed';
import ShareTo from '../explore/ShareTo';
import { useNavigate } from 'react-router-dom';
import account from '../../assets/images/account.png'
import { getUserById } from '@/api/authApi/auth';


import { setPost, setStep, addComments } from '@/store/formSlice';
import InfiniteScroll from 'react-infinite-scroll-component';
import { getFollowing } from '@/api/authApi/graph';
import { SuggestionsContext } from './SuggestionsContext';
import React from 'react';
import { getAllPosts } from '@/api/authApi/post';
import { AppContext } from '@/context/AppProvider';

const Post = () => {
    const { setIsLoading } = useContext(AppContext)
    const [icons, setIcons] = useState({});
    const [bookmark, setBookmark] = useState(false);
    const [showOptions, setShowOptions] = useState(false);
    const [showComment, setShowComment] = useState(false);
    const [showShare, setShowShare] = useState(false);
    const [post, setPost] = useState([]);
    const [currentPost, setCurrentPost] = useState(null);
    const [limit, setLimit] = useState(3);
    const [total, setTotal] = useState(0);
    const [hasMore, setHasMore] = useState(true);
    const [page, setPage] = useState(1);
    const [user, setUser] = useState({});
    const [showEmoji, setShowEmoji] = useState(false);
    const { comments, addComment, likes, toggleLike } = useContext(SuggestionsContext);
    const [input, setInput] = useState('');
    const [isRender, setIsRender] = useState(false)
    const [isLiked, setIsLiked] = useState(!!likes[post.id]); // Set initial state based on context

    useEffect(() => {
        const getPost = async () => {
            const id = localStorage.getItem('userId');
            try {
                setIsLoading(true);
                let posts = { data : [] } ;
                if( id != null )
                {
                    posts = await newsFeed(id, limit);
                }
                const explores = await getAllPosts(1,10);

                console.log("newfeed", posts.data); // Đảm bảo post chứa dữ liệu đúng
                const exploresList = explores.data;
                console.log(exploresList);

                setPost(prev => {
                    const combinedData = [...exploresList, ...prev, ...posts.data];
                    const uniqueData = combinedData.filter((value, index, self) => 
                      index === self.findIndex((t) => t.id === value.id)
                    );
                    return uniqueData;
                  });
                  
                setTotal(posts.total);
                setHasMore(posts.data.length + post.length < posts.total);
                setIsLoading(false);
            } catch (error) {
                console.error("Lỗi khi lấy dữ liệu bài đăng", error);
            }
        }
        getPost();
    }, [page]);


    const inputRef = React.createRef();
    const me = useSelector((state) => state.user);
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
        if ( post.userId )
        {
            const getData = async () => {
                const res = await getUserById(post.userId);
                setUser(res.profile);
            }
            getData();
        }
    }, [post.userId, isRender]);

    const handleSend = () => {
        if (input.trim() !== '') {
            const newComment = {
                user: me,
                comment: input.trim(),
                postId: post.id,  // Sử dụng currentPost.id thay vì post.id
            };
            addComment(post.id, newComment); // Sử dụng currentPost.id thay vì post.id
            setInput('');  // Xóa nội dung ô input sau khi gửi bình luận
        }
    };
    const handleLikeToggle = () => {
        toggleLike(post.id);
        setIsLiked(prev => !prev); // Update local state for immediate UI feedback
    };
    useEffect(() => {
        setIsLiked(!!likes[post.id]); // Update isLiked based on context
    }, [likes, post.id]);



    const fetchMore = () => {
        if (post.length >= total) {
            setHasMore(false);
            return;
        }
        if (page === 1) {
            setPage(1);
        }
        else {
            setPage(prev => prev + 1);
        }
        setLimit(2)
    }
    const navigate = useNavigate();

    const handleShowShare = () => {
        setShowShare(true);
    }

    const cancelShowShare = () => {
        setShowShare(false);
    }

    const handleShowComment = (item) => {
        setShowComment(true);
        setCurrentPost(item);
    }

    const cancelShowComment = () => {
        setShowComment(false);
    }

    const handleshowOptions = () => {
        setShowOptions(true);
    }

    const cancelShowOptions = () => {
        setShowOptions(false);
    }


    const handleChangeBookmark = () => {
        setBookmark(!bookmark);
    }
    const handleClickProfileUser = (id) => {
        navigate(`/profile/${id}`);
    };

    return (
        <InfiniteScroll
            dataLength={post.length}
            next={fetchMore}
            hasMore={true}
        >
            <div className="post">
                {post.map((item, id) => (
                    <div className="post-container" key={id}>
                        {/* header */}
                        <div className="post-header">
                            <div className="post-header-left">
                                <div className="post-header-avt">
                                    <img src={item?.userAvartar || avt} alt="" />
                                </div>
                            </div>
                            <div className="post-header-right">
                                <div className="post-header-username">
                                    <p onClick={() => handleClickProfileUser(item.userId)}>{item.userName}</p>

                                </div>
                                <div className="post-header-option">
                                    <span>
                                        <i onClick={handleshowOptions} className="fa-solid fa-ellipsis"></i>
                                    </span>
                                </div>
                            </div>
                        </div>
                        {/* image */}
                        <div className="post-image">
                            <div className="i">
                                <Carousel arrows infinite={false} >
                                    {item.imageUrls.map((imgSrc, imgId) => (
                                        <div className="image-slider">
                                            <img key={imgId} src={imgSrc} alt="" />
                                        </div>
                                    ))}
                                </Carousel>
                            </div>
                        </div>
                        {/* group-bottom */}
                        <div className="post-group-bottom">
                            <div className="icons">
                                <div className="icons-left">
                                    <span >
                                        {/* {!icons[item.id] ? (
                                            <i className="fa-regular fa-heart" onClick={() => handleLikeToggle(item.id)}></i>
                                        ) :
                                            (
                                                <i className="fa-solid fa-heart" style={{ color: '#f20d0d', scale: '1.1' }} onClick={() => handleLikeToggle(item.id)}></i>
                                            )} */}
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
                                        <i onClick={() => handleShowComment(item)} className="fa-regular fa-comment"></i>
                                    </span>
                                    <span>
                                        <i onClick={handleShowShare} className="fa-regular fa-paper-plane"></i>
                                    </span>
                                </div>
                                <div className="icons-right">
                                    <span>
                                        {!bookmark ? (
                                            <i className="fa-regular fa-bookmark" onClick={handleChangeBookmark}></i>
                                        )
                                            : (<i className="fa-solid fa-bookmark" onClick={handleChangeBookmark}></i>)
                                        }

                                    </span>
                                </div>
                            </div>
                            <div className="post-likes">
                                <p><span>{Object.keys(likes).filter(id => id === post.id).length}</span> lượt thích</p>
                            </div>
                        </div>
                        {/* caption */}
                        <div className="post-caption">
                            <div className="pos-caption-user">
                                <span className='username'>
                                    <p>{item.username}</p>
                                </span>
                                <span className='caption'>
                                    {item.content}
                                </span>
                            </div>
                            <p className="post-caption-time">
                                <span>{item.day}</span> ngày trước
                            </p>
                        </div>
                        <div className="post-comment">
                            <form>
                                <span style={{ position: 'relative' }}>
                                    <i className="fa-regular fa-face-smile" onClick={() => setShowEmoji(!showEmoji)}></i>
                                    {
                                        showEmoji && (
                                            <EmojiPicker onEmojiClick={addEmoji} className='emoj' />
                                        )
                                    }
                                </span>
                                <input type="text" value={input} onChange={(e) => setInput(e.target.value)} onClick={() => setShowEmoji(false)} ref={inputRef} placeholder="Thêm bình luận..." />
                                <p className="btn-post-comment" onClick={handleSend}>Đăng</p>
                            </form>
                        </div>
                    </div>
                ))}
                {showComment && currentPost && (
                    <div className='overlay' onClick={cancelShowComment}>
                        <motion.div
                            className='note-container'
                            onClick={(e) => e.stopPropagation()}
                            animate={{ opacity: 1, scale: 1 }}
                            initial={{ opacity: 0, scale: 0.5 }}
                            transition={{ duration: 0.3 }}
                        >
                            <Comment post={currentPost} />
                        </motion.div>
                    </div>
                )}
                {showOptions && (
                    <div className='overlay' onClick={cancelShowOptions}>
                        <motion.div
                            className='note-container'
                            onClick={(e) => e.stopPropagation()}
                            animate={{ opacity: 1, scale: 1 }}
                            initial={{ opacity: 0, scale: 0.5 }}
                            transition={{ duration: 0.3 }}
                        >
                            <Options oncancel={cancelShowOptions} />
                        </motion.div>
                    </div>
                )}
                {showShare && (
                    <div className='overlay' onClick={cancelShowShare}>
                        <motion.div
                            className='note-container'
                            onClick={(e) => e.stopPropagation()}
                            animate={{ opacity: 1, scale: 1 }}
                            initial={{ opacity: 0, scale: 0.5 }}
                            transition={{ duration: 0.3 }}
                        >
                            <ShareTo oncancel={cancelShowShare} />
                        </motion.div>
                    </div>
                )}
            </div>
        </InfiniteScroll>
    )
}

export default Post;
