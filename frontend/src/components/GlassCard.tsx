import { Component, ParentProps } from "solid-js";

const GlassCard: Component<ParentProps> = (props) => {
  return (
    <div class="card-modern animate-fade-in-up max-w-4xl w-full mx-auto p-8">
      <div class="relative">
        {/* Glow effect */}
        <div class="absolute inset-0 bg-gradient-to-r from-blue-400/20 via-purple-400/20 to-pink-400/20 rounded-3xl blur-3xl"></div>

        {/* Main content */}
        <div class="relative glass-strong rounded-3xl p-8 border border-white/20">
          {props.children}
        </div>
      </div>
    </div>
  );
};

export default GlassCard;
