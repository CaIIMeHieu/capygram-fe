// SuggestionsContext.js
import React, { createContext, useState, useEffect } from 'react';
import { getPostByUserId } from '@/api/authApi/post';
import { getCountFollower, getCountFollowing } from '@/api/authApi/graph';
import { follow, getFollowing, unFollow } from '@/api/authApi/graph';

export const SuggestionsContext = createContext();

export const SuggestionsProvider = ({ children }) => {
    const [suggestions, setSuggestions] = useState([]);
    const [isFollow, setIsFollow] = useState({});
    const [hoveredItem, sethoveredItem] = useState({ id: null, type: null });
    const [hoveredProfile, setHoveredProfile] = useState({ id: null, type: null });
    const [isDarkNight, setIsDarkNight] = useState(false);
    const [post, setPost] = useState(0);
    const [follower, setFollower] = useState(0);
    const [following, setFollowing] = useState(0);
    const [isRender, setIsRender] = useState(false);
    const [userId, setUserId] = useState(null);

    const handleToggle = () => setIsDarkNight(!isDarkNight);

    const handleFollowClick = async (id) => {
        const userId = localStorage.getItem('userId');
        if (isFollow[id]) {
            // Unfollow
            await unFollow(userId, id);
            setIsFollow(prev => {
                const updatedFollowStatus = { ...prev, [id]: false };
                return updatedFollowStatus;
            });
        } else {
            // Follow
            await follow(userId, id);
            setIsFollow(prev => {
                const updatedFollowStatus = { ...prev, [id]: true };
                return updatedFollowStatus;
            });
        }
        setIsRender(!isRender);
    };

    const handleMouseEnter = (id, type) => {
        sethoveredItem({ id, type });
        setUserId(id);
    };
    const handleMouseLeave = () => sethoveredItem({ id: null, type: null });
    const handleMouseProfileEnter = (id, type) => setHoveredProfile({ id, type });
    const handleMouseProfileLeave = () => setHoveredProfile({ id: null, type: null });

    useEffect(() => {
        const fetchSuggestions = async () => {
            const userId = localStorage.getItem('userId');
            const followingUsers = await getFollowing(userId);

            const fetchFollowingUsers = async () => {
                const allFollowingOfFollowing = [];
                for (const user of followingUsers) {
                    const Id = user.id;
                    const followingOfFollowing = await getFollowing(Id);
                    allFollowingOfFollowing.push(...followingOfFollowing);
                }
                return allFollowingOfFollowing;
            };

            const allSuggestions = await fetchFollowingUsers();
            const followingIds = new Set(followingUsers.map(user => user.id));
            const uniqueSuggestions = Array.from(new Set(allSuggestions.map(user => user.id)))
                .map(id => allSuggestions.find(user => user.id === id))
                .filter(user => user.id !== userId && !followingIds.has(user.id));

            setSuggestions(uniqueSuggestions);
        };

        fetchSuggestions();
    }, []);

    useEffect(() => {
        document.body.className = isDarkNight ? 'dark-mode' : 'light-mode';
    }, [isDarkNight]);

    useEffect(() => {
        if (userId) {
            const getInfo = async () => {
                try {
                    const posts = await getPostByUserId(userId);
                    setPost(posts.length);
                    const followerCount = await getCountFollower(userId);
                    setFollower(followerCount);
                    const followingCount = await getCountFollowing(userId);
                    setFollowing(followingCount);
                } catch (error) {
                    console.log(error);
                }
            };
            getInfo();
        }
    }, [userId]);

    const [comments, setComments] = useState(() => {
        const savedComments = localStorage.getItem('comments');
        return savedComments ? JSON.parse(savedComments) : {};
    });

    useEffect(() => {
        localStorage.setItem('comments', JSON.stringify(comments));
    }, [comments]);

    const addComment = (postId, comment) => {
        setComments(prev => ({
            ...prev,
            [postId]: [...(prev[postId] || []), comment]
        }));
    };

    // Tổng số lượt thích toàn cầu
    const [likes, setLikes] = useState(() => {
        const storedLikes = JSON.parse(localStorage.getItem('likes')) || {};
        return storedLikes;
    });

    // Các bài viết mà tài khoản hiện tại đã thích
    const [userLikes, setUserLikes] = useState(() => {
        const storedUserLikes = JSON.parse(localStorage.getItem('userLikes')) || {};
        return storedUserLikes;
    });

    // Cập nhật vào localStorage
    useEffect(() => {
        localStorage.setItem('likes', JSON.stringify(likes));
    }, [likes]);

    useEffect(() => {
        localStorage.setItem('userLikes', JSON.stringify(userLikes));
    }, [userLikes]);

    // Hàm thay đổi trạng thái like
    const toggleLike = (postId) => {
        const userId = localStorage.getItem('userId');

        setLikes(prevLikes => {
            const newLikes = { ...prevLikes };
            // Nếu bài viết đã có lượt thích, xóa khỏi danh sách
            if (newLikes[postId]) {
                delete newLikes[postId];
            } else {
                newLikes[postId] = true;
            }
            return newLikes;
        });

        setUserLikes(prevUserLikes => {
            const newUserLikes = { ...prevUserLikes };
            // Cập nhật trạng thái like của tài khoản hiện tại
            if (newUserLikes[userId]) {
                newUserLikes[userId].includes(postId)
                    ? newUserLikes[userId].splice(newUserLikes[userId].indexOf(postId), 1)
                    : newUserLikes[userId].push(postId);
            } else {
                newUserLikes[userId] = [postId];
            }
            return newUserLikes;
        });
    };
    return (
        <SuggestionsContext.Provider value={{ likes, userLikes, toggleLike, comments, addComment, suggestions, setSuggestions, isFollow, handleFollowClick, handleMouseEnter, handleMouseLeave, handleMouseProfileEnter, handleMouseProfileLeave, hoveredItem, hoveredProfile, isDarkNight, handleToggle, post, setPost, follower, setFollower, following, setFollowing }}>
            {children}
        </SuggestionsContext.Provider>
    );
};
