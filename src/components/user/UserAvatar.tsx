import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

interface UserAvatarProps {
  name?: string;
  imageUrl?: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const sizeClasses = {
  sm: "h-8 w-8 text-xs",
  md: "h-10 w-10 text-sm",
  lg: "h-12 w-12 text-base",
};

export const UserAvatar = ({ name, imageUrl, size = "md", className }: UserAvatarProps) => {
  // Get first Hebrew/English letter
  const getInitial = (name?: string) => {
    if (!name) return "?";
    const firstChar = name.trim().charAt(0);
    return firstChar.toUpperCase();
  };

  return (
    <Avatar className={cn(sizeClasses[size], className)}>
      {imageUrl && <AvatarImage src={imageUrl} alt={name || "User"} />}
      <AvatarFallback className="bg-primary text-primary-foreground font-medium">
        {getInitial(name)}
      </AvatarFallback>
    </Avatar>
  );
};

export default UserAvatar;
