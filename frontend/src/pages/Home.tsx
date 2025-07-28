import { Component } from "solid-js";
import GlassCard from "../components/GlassCard.jsx";
import UserLogo from '../assets/Default.png';
import { logout } from "../Services/LoginService.js";
import { useNavigate } from "@solidjs/router";

const Home: Component = () => {
    const navigate = useNavigate();
    const username = localStorage.getItem("username") || '';

    const handleLogout = () => {
        logout(username, navigate);
    }

    return (
        <div class="flex items-center justify-center min-h-screen">
            <GlassCard>
                <div class="flex">
                    <h2 class="text-gray-500 font-bold text-2xl mr-5 animate-pulse">DevTasks</h2>
                    <button onclick={handleLogout} class="bg-red-950 text-gray-300 py-2 px-3 rounded-md ml-45 cursor-pointer duration-300 hover:scale-105">Logout</button>
                    
                </div>
                <hr class="text-gray-500 my-4" />
                <div class="col-auto">
                    <div class="bg-gray-700 flex text-gray-300 my-3 p-4 rounded-md cursor-pointer hover:scale-105 duration-300">
                        <h2 class="font-bold">Project 1</h2>
                        <span class="m-auto">Description</span>
                    </div>

                    <div class="bg-gray-700 flex text-gray-300 my-3 p-4 rounded-md cursor-pointer hover:scale-105 duration-300">
                        <h2 class="font-bold">Project 1</h2>
                        <span class="m-auto">Description</span>
                    </div>

                    <div class="bg-gray-700 flex text-gray-300 my-3 p-4 rounded-md cursor-pointer hover:scale-105 duration-300">
                        <h2 class="font-bold">Project 1</h2>
                        <span class="m-auto">Description</span>
                    </div>

                    <div class="bg-gray-700 flex text-gray-300 my-3 p-4 rounded-md cursor-pointer hover:scale-105 duration-300">
                        <h2 class="font-bold">Project 1</h2>
                        <span class="m-auto">Description</span>
                    </div>

                    <div class="bg-gray-700 flex text-gray-300 my-3 p-4 rounded-md cursor-pointer hover:scale-105 duration-300">
                        <h2 class="font-bold">Project 1</h2>
                        <span class="m-auto">Description</span>
                    </div>
                </div>
                <button class="bg-green-700 text-gray-300 py-2 px-4 rounded-md mt-4 cursor-pointer duration-300 hover:scale-105">New Project</button>
            </GlassCard>
        </div>
    );
}

export default Home;