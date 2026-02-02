import React, { useContext } from "react";
import { AuthContext } from "../Context/AuthContext";
import { useNavigate } from "react-router-dom";

const Profile = () => {
	const { logout, currentUser } = useContext(AuthContext);
	const navigate = useNavigate();

	const handleLogOut = () => {
		logout();
		navigate("/");
	};

	return (
		<div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center p-4 sm:p-6">
			<div className="w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
				{/* Header / Avatar section */}
				<div className="px-8 pt-10 pb-6 bg-gradient-to-b from-indigo-50 to-white text-center">
					<div className="relative inline-block mb-5">
						<img
							src={
								currentUser.avatar ||
								"https://ui-avatars.com/api/?name=User&size=128&background=0D8ABC&color=fff"
							}
							alt={currentUser.username}
							className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-lg mx-auto transition-transform duration-300 hover:scale-105"
							onError={(e) => {
								e.currentTarget.src =
									"https://ui-avatars.com/api/?name=User&size=128&background=0D8ABC&color=fff";
							}}
						/>
					</div>

					<h1 className="text-3xl font-bold text-gray-800 mb-1">
						{currentUser.username}
					</h1>
					<p className="text-gray-500 text-sm">{currentUser.email}</p>
				</div>

				{/* Actions */}
				<div className="px-8 pb-10 pt-4 space-y-4">
					<button
						type="button"
						className="w-full py-3.5 px-6 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-medium rounded-xl transition-all duration-200 shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2"
						onClick={() => navigate("/userform")}
					>
						Edit Profile
					</button>

					<button
						onClick={handleLogOut}
						className="w-full py-3.5 px-6 bg-white border border-red-200 hover:bg-red-50 active:bg-red-100 text-red-600 font-medium rounded-xl transition-all duration-200 shadow-sm hover:shadow focus:outline-none focus:ring-2 focus:ring-red-300 focus:ring-offset-2"
					>
						Log Out
					</button>
				</div>
			</div>
		</div>
	);
};

export default Profile;
