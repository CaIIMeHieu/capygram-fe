/* eslint-disable */
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next';
import '@/i18n';
import { motion } from 'framer-motion';
import { useParams } from 'react-router-dom';

import account from '@/assets/images/account.png';
import postIcon from '@/assets/images/post.png';
import tagged from '@/assets/images/tagged.png';

import { getUserById } from '@/api/authApi/auth';
import LayoutFooter from '@/layouts/LayoutFooter';
import FollowUserOption from '@/components/followUserOption/FollowUserOption';
import MoreOption from '@/components/followUserOption/MoreOption';
import { follow, getCountFollower, getCountFollowing, getFollowers } from '@/api/authApi/graph';
import { getPostByUserId } from '@/api/authApi/post';
import PostInProfileUser from './PostInProfileUser';
import ListFollowerUser from './ListFollowerUser';

import cute from '@/assets/images/cute.gif';
import down from '@/assets/images/down.png';
import addFriend from '@/assets/images/addFriend.png';
import more from '@/assets/images/more.png';

import './ProfileUser.scss';
import ListFollowingUser from './ListFollowingUser';

const ProfileUser = () => {
  const { id } = useParams();
  const [activeItem, setActiveItem] = useState("post");
  const [showOption, setShowOption] = useState(false);
  const [showMore, setShowMore] = useState(false);
  const [user, setUser] = useState({});
  const [post, setPost] = useState(0);
  const [posts, setPosts] = useState([]);
  const [follower, setFollower] = useState(0);
  const [following, setFollowing] = useState(0);
  const [showListFollower, setShowListFollower] = useState(false);
  const [showListFollowing, setShowListFollowing] = useState(false);
  const [isLogin,setIsLogin] = useState( localStorage.getItem("userId") );
  const [isFollowing, setIsFollowing] = useState(false);

  const { t } = useTranslation('profile');

  useEffect(() => {
    const getInfo = async () => {
      const followers = await getFollowers(id);
      const userId = localStorage.getItem("userId");
      followers.forEach(element => {
        if (element.id === userId) {
          setIsFollowing(true);
        }
      });
      const user = await getUserById(id);
      setUser(user);
      const posts = await getPostByUserId(id);
      setPost(posts.length);
      setPosts(posts);
      const follower = await getCountFollower(id);
      setFollower(follower);
      const following = await getCountFollowing(id);
      setFollowing(following);
    }

    getInfo();
  }, []);

  const handleClick = (item) => {
    setActiveItem(item);
  }

  const handleCancel = () => {
    setShowOption(false);
  };

  const handleCancel2 = () => {
    setShowMore(false);
  };

  const handleCancelListFollower = () => {
    setShowListFollower(false);
  };

  const handleCancelListFollowing = () => {
    setShowListFollowing(false);
  };

  const hotStory = [
    {
      id: 1,
      name: 'Stories',
      coverPhoto: cute
    },
    {
      id: 2,
      name: 'Stories',
      coverPhoto: cute
    },
    {
      id: 3,
      name: 'Stories',
      coverPhoto: cute
    },
    {
      id: 4,
      name: 'Stories',
      coverPhoto: cute
    },
    {
      id: 5,
      name: 'Stories',
      coverPhoto: cute
    }

  ];

  return (

    <div className='body-profile'>
      <div className='content-top'>
        <div className='group-avata'>
          <div className='avata'>
            <img src={user?.profile?.avatarUrl !== ('string' && '') ? user?.profile?.avatarUrl : account} alt='avata' />
          </div>

          <div className='hot-story'>
            {(hotStory.length > 0) && (
              hotStory.map((item, index) => (
                <div className='story' key={index}>
                  <div className='image'>
                    <img src={item.coverPhoto} alt='hotStory' />
                  </div>
                  <p>{item.name}</p>
                </div>
              ))
            )}
          </div>
        </div>

        <div className='right'>
          <div className='action'>
            <p className='name'><b>{user?.profile?.fullName}</b></p>
            <div className='group-btn'>
              {
                isLogin && isFollowing && <>
                <button className='btn-action-1' onClick={() => setShowOption(true)}>
                <p><b>{t('following')}</b></p>
                <img src={down} alt='down' />
              </button>
              <button className='btn-action-2'>
                <p><b>{t('message')}</b></p>
              </button>
              <img src={more} alt='more' onClick={() => setShowMore(true)} />
                </>
              }              
            </div>
            <div className='group-btn'>
              {
                isLogin && !isFollowing && 
                ( <div>
                <button className='btn-action-1' style={{
                  backgroundColor: '#0095f6',
                  color: '#fff',
                }} onClick={ async () => {
                  setIsFollowing(true)
                  setFollower(follower + 1);
                  await follow(isLogin,id);
                }}>
                  <p><b>{t('follow')}</b></p>
                  </button>
                </div> )
              }
            </div>
          </div>

          <div className='data'>
            <p><b>{post}</b> {t('posts')}</p>
            <p
              onClick={() => setShowListFollower(true)}
            >
              <b>{follower}</b> {t('followers')}
            </p>
            <p onClick={() => setShowListFollowing(true)}><b>{following}</b> {t('following')}</p>
          </div>

        </div>
      </div>

      <div className='content-bottom'>
        <div className='menu-profile'>
          <div className={`menu-item ${activeItem === 'post' ? 'active' : ''}`} onClick={() => handleClick('post')}>
            <img src={postIcon} alt='post' />
            <p>{t('post')}</p>
          </div>

          <div className={`menu-item ${activeItem === 'tagged' ? 'active' : ''}`} onClick={() => handleClick('tagged')}>
            <img src={tagged} alt='tagged' />
            <p>{t('tagged')}</p>
          </div>
        </div>

        <div className='list-post'>
          {
            activeItem === 'post' && (
              <PostInProfileUser posts={posts} userId={id} />
            )
          }
        </div>
      </div>

      {
        showOption && (
          <div className='overlay' onClick={handleCancel}>
            <motion.div
              className='option-container'
              onClick={(e) => e.stopPropagation()}
              animate={{ opacity: 1, scale: 1 }}
              initial={{ opacity: 0, scale: 0.5 }}
              transition={{ duration: 0.3 }}
            >
              <FollowUserOption onCancel={handleCancel} user={user} />
            </motion.div>
          </div>
        )
      }

      {
        showMore && (
          <div className='overlay' onClick={handleCancel2}>
            <motion.div
              className='option-container'
              onClick={(e) => e.stopPropagation()}
              animate={{ opacity: 1, scale: 1 }}
              initial={{ opacity: 0, scale: 0.5 }}
              transition={{ duration: 0.3 }}
            >
              <MoreOption onCancel={handleCancel2} />
            </motion.div>
          </div>
        )
      }

      {
        showListFollower && (
          <div className='overlay' onClick={handleCancelListFollower}>
            <motion.div
              className='option-container'
              onClick={(e) => e.stopPropagation()}
              animate={{ opacity: 1, scale: 1 }}
              initial={{ opacity: 0, scale: 0.5 }}
              transition={{ duration: 0.3 }}
            >
              <ListFollowerUser onCancel={handleCancelListFollower} Id={id} />
            </motion.div>
          </div>
        )
      }

      {
        showListFollowing && (
          <div className='overlay' onClick={handleCancelListFollowing}>
            <motion.div
              className='option-container'
              onClick={(e) => e.stopPropagation()}
              animate={{ opacity: 1, scale: 1 }}
              initial={{ opacity: 0, scale: 0.5 }}
              transition={{ duration: 0.3 }}
            >
              <ListFollowingUser onCancel={handleCancelListFollowing} Id={id} />
            </motion.div>
          </div>
        )
      }
      <LayoutFooter />
    </div>

  )
}

export default ProfileUser;