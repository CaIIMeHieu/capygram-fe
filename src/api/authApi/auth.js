import { authInstance, publicInstance, request, requestWithToken } from "@/utils/axios-http/axios-http";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";

export const register = async (data) => {
  try {
    const { fullname, email, username, password, month, day, year, otp, avatarUrl } = data;
    const date = new Date(year, month - 1, day);
    const birthday = date.toISOString();

    await request(publicInstance, {
      data: {
        fullName: fullname,
        email,
        userName: username,
        password,
        birthday: birthday,
        otp,
        avatarUrl,
      },
      method: "post",
      url: "/api/Users/register"
    });

  } catch (error) {
    console.log(error);
    throw error;
  }
}

export const active_account = async (data) => {
  try {
    const { fullname, email, username, password, month, day, year, otp, avatarUrl } = data;
    const date = new Date(year, month - 1, day);
    const birthday = date.toISOString();

    //gọi API và chờ phản hồi

    await request(authInstance, {
      data: {
        fullName: fullname,
        email,
        userName: username,
        password,
        birthday: birthday,
        otp,
        avatarUrl,
      },
      method: "post",
      url: "/api/Users/active-account"
    });
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export const login = async (data) => {
  try {
    const { username, password } = data;

    //gọi API và chờ phản hồi
    const response = await request(publicInstance, {
      data: {
        userName: username,
        password,
      },
      method: "post",
      url: "/api/Users/login"
    });

    //lấy refreshToken và accessToken từ phản hồi
    const { refreshToken, accessToken, id } = response.data.value;
    localStorage.setItem("refreshToken", refreshToken);
    localStorage.setItem("accessToken", accessToken);

    //có getMe sẽ lưu vào redux user
    localStorage.setItem("userId", id);
    //getMe();
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const getUserById = async (id) => {
  try {
    const response = await request(authInstance, {
      method: "get",
      url: `/api/Users/get-user-by-userID?UserID=${id}`
    });

    return response.data.value;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export const logout = async () => {
  try {
    const userId = localStorage.getItem("userId");

    await request(authInstance, {
      method: "post",
      url: `/api/Users/logout?Id=${userId}`
    });

    localStorage.removeItem("refreshToken");
    localStorage.removeItem("accessToken");
    localStorage.removeItem("userId");
    localStorage.removeItem("persist:user");
    localStorage.removeItem("userLikes");
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export const editProfile = async (data) => {
  //cần xoá avatarUrl
  try {
    const { bio, sex } = data;
    //se thay doi cach lay id sau
    const id = localStorage.getItem("userId");

    let gender;
    if (sex === 'male') {
      gender = 1;
    }
    else if (sex === 'female') {
      gender = 2;
    } else {
      gender = 0;
    }

    await requestWithToken(authInstance, {
      data: {
        id,
        story: bio,
        gender,
      },
      method: "post",
      url: "/api/Users/edit"
    });

  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const uploadAvatar = async (data, userId,setNewAvatar) => {
  try {
    const formData = new FormData();
    formData.append('fileToUpload', data);
    formData.append('userId', userId);

    const response = await requestWithToken(authInstance, {
      data: formData,
      headers: {
        'Content-Type': 'multipart/form-data'
      },
      method: "post",
      url: "/api/Users/upload-avatar"
    });
    toast.success("Cập nhật ảnh đại diện thành công !")
    setNewAvatar(response.data.value.profile.avatarUrl);
    return response.data.value;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export const refreshToken = async () => {
  const refreshToken = localStorage.getItem("refreshToken");
  const accessToken = localStorage.getItem("accessToken");
  const userId = localStorage.getItem("userId");
  try {
    const response = await request(authInstance, {
      data: {
        refreshToken,
        accessToken,
        id: userId
      },
      method: "post",
      url: "/api/Users/refresh-token"
    });
    return response.data.value;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const getUserByName = async (UserName) => {
  try {
    const response = await requestWithToken(authInstance, {
      method: "get",
      url: `/api/Users/get-user-by-name?UserName=${UserName}`
    });

    return response.data.value;
  } catch (error) {
    console.log(error);
    throw error;
  }
};