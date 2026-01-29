import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { 
  Gift, 
  Store,
  Radio,
  Loader2,
  Copy,
  Settings,
  User,
  ChevronLeft,
  ChevronRight,
  Crown,
  Zap
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/language-context";
import type { Room } from "@shared/schema";
import { vipService } from "@/lib/vip-service";
import { getNextLevelInfo, VIP_LEVELS } from "@/lib/vip-config";
import { Progress } from "@/components/ui/progress";

export default function ProfilePage() {
  const [, setLocation] = useLocation();
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const { toast } = useToast();
  const { t, isRTL } = useLanguage();

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      toast({
        title: t.profile.signInRequired,
        description: t.profile.signInToView,
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/login";
      }, 500);
    }
  }, [isAuthenticated, authLoading, toast, t]);

  const { data: userRooms, isLoading: roomsLoading } = useQuery<Room[]>({
    queryKey: ["/api/user/rooms"],
    enabled: isAuthenticated,
  });

  const { data: coinsData } = useQuery<{ balance: number; totalEarned: number }>({
    queryKey: ["/api/user/coins"],
    enabled: isAuthenticated,
  });

  const pastStreams = userRooms?.filter(r => !r.isLive) || [];
  
  const vipState = vipService.getVipState();
  const nextLevelInfo = getNextLevelInfo(vipState.currentLevel, vipState.exp);
  const currentLevelData = VIP_LEVELS.find(l => l.level === vipState.currentLevel);
  const nextLevelData = nextLevelInfo ? VIP_LEVELS.find(l => l.level === nextLevelInfo.nextLevel) : null;
  const rawProgressPercent = nextLevelInfo 
    ? ((vipState.exp - (currentLevelData?.thresholdExp || 0)) / ((nextLevelData?.thresholdExp || 1) - (currentLevelData?.thresholdExp || 0))) * 100
    : 100;
  const progressPercent = Math.min(100, Math.max(0, rawProgressPercent));

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return null;
  }

  const fullName = user.firstName && user.lastName 
    ? `${user.firstName} ${user.lastName}` 
    : user.firstName || t.common.user;

  return (
    <div className="min-h-screen pb-20 md:pb-8" style={{ paddingTop: 'env(safe-area-inset-top)' }}>
      <div className="relative h-32 bg-gradient-to-r from-primary via-pink-500 to-purple-500">
        <div className="absolute -bottom-16 left-1/2 -translate-x-1/2">
          <div className="relative">
            <Avatar className="h-32 w-32 border-4 border-background">
              <AvatarImage src={user.profileImageUrl || undefined} alt={fullName} />
              <AvatarFallback className="bg-primary text-primary-foreground text-4xl">
                {user.firstName?.charAt(0) || "U"}
              </AvatarFallback>
            </Avatar>
          </div>
        </div>
      </div>

      <div className="container max-w-2xl px-4 pt-20">
        <div className="text-center mb-8">
          <h1 className="font-display text-2xl font-bold mb-1" data-testid="text-username">
            {fullName}
          </h1>
          <div className="flex justify-center mb-4">
            <button
              onClick={() => {
                const idToCopy = user.publicId || user.id;
                if (!idToCopy) return;
                navigator.clipboard.writeText(String(idToCopy));
                toast({
                  title: isRTL ? 'تم نسخ الآيدي' : 'ID Copied',
                });
              }}
              className="flex items-center gap-1.5 bg-green-500/20 text-green-400 px-3 py-1 rounded-full text-sm font-medium"
              data-testid="button-copy-id"
            >
              <span className="font-bold" data-testid="text-user-id">{user.publicId || user.id}</span>
              <span>ID</span>
              <Copy className="h-3 w-3" />
            </button>
          </div>

          <div className={`flex justify-center gap-8 py-4 border-y ${isRTL ? 'flex-row-reverse' : ''}`}>
            <div className="text-center">
              <div className="font-display text-2xl font-bold" data-testid="stat-followers">0</div>
              <div className="text-sm text-muted-foreground">{t.common.followers}</div>
            </div>
            <div className="text-center">
              <div className="font-display text-2xl font-bold" data-testid="stat-following">0</div>
              <div className="text-sm text-muted-foreground">{t.common.following}</div>
            </div>
            <div className="text-center">
              <div className="font-display text-2xl font-bold" data-testid="stat-gifts">
                {coinsData?.totalEarned || 0}
              </div>
              <div className="text-sm text-muted-foreground">{t.profile.totalGifts}</div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-8">
          <Link href="/coins">
            <div className="bg-gradient-to-br from-amber-500/10 to-orange-500/10 border rounded-xl p-4 hover-elevate cursor-pointer" data-testid="card-coins">
              <div className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <div className={isRTL ? 'text-right flex-1' : 'flex-1'}>
                  <p className="text-sm text-muted-foreground">{t.profile.coinBalance}</p>
                  <p className="font-display text-xl font-bold">
                    {coinsData?.balance?.toLocaleString() || 1000}
                  </p>
                </div>
                <div className="h-14 w-14 rounded-xl bg-gradient-to-br from-amber-500/20 to-orange-500/10 border border-amber-500/30 flex items-center justify-center">
                  <Gift className="h-7 w-7 text-amber-500" />
                </div>
              </div>
            </div>
          </Link>
          
          <Link href="/go-live">
            <div className="bg-gradient-to-br from-primary/10 to-pink-500/10 border rounded-xl p-4 hover-elevate cursor-pointer" data-testid="card-go-live">
              <div className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <div className={isRTL ? 'text-right flex-1' : 'flex-1'}>
                  <p className="font-display text-xl font-bold">{t.profile.goLive}</p>
                </div>
                <div className="h-14 w-14 rounded-xl bg-gradient-to-br from-primary/20 to-pink-500/10 border border-primary/30 flex items-center justify-center">
                  <Radio className="h-7 w-7 text-primary" />
                </div>
              </div>
            </div>
          </Link>
        </div>

        <Link href="/vip">
          <div className="bg-gradient-to-br from-amber-500/10 via-yellow-500/10 to-amber-600/10 border border-amber-500/20 rounded-xl p-4 hover-elevate cursor-pointer mb-4" data-testid="card-vip-level">
            <div className={`flex items-center gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
              {isRTL ? <ChevronLeft className="h-5 w-5 text-amber-400" /> : <ChevronRight className="h-5 w-5 text-amber-400" />}
              <div className={`flex-1 ${isRTL ? 'text-right' : ''}`}>
                <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <h3 className="font-display text-lg font-bold text-amber-400">
                    {isRTL ? "مستوى VIP" : "VIP Level"}
                  </h3>
                  <span className="text-amber-400 font-bold">VIP{vipState.currentLevel}</span>
                </div>
                <div className={`flex items-center gap-2 text-sm text-muted-foreground ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <Zap className="h-3 w-3 text-amber-400" />
                  <span>EXP {vipState.exp.toLocaleString()}</span>
                </div>
                <div className="mt-2">
                  <Progress value={progressPercent} className="h-1.5 bg-gray-700" />
                </div>
              </div>
              <div className="h-14 w-14 rounded-xl bg-gradient-to-br from-amber-500/20 to-amber-600/10 border border-amber-500/30 flex items-center justify-center relative">
                <Crown className="h-7 w-7 text-amber-400" />
                <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-amber-500 flex items-center justify-center text-[10px] font-bold text-black">
                  {vipState.currentLevel}
                </div>
              </div>
            </div>
          </div>
        </Link>

        <Link href="/store">
          <div className="bg-gradient-to-br from-primary/10 via-pink-500/10 to-purple-500/10 border rounded-xl p-4 hover-elevate cursor-pointer" data-testid="card-store-shortcut">
            <div className={`flex items-center gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
              {isRTL ? <ChevronLeft className="h-5 w-5 text-muted-foreground" /> : <ChevronRight className="h-5 w-5 text-muted-foreground" />}
              <div className={`flex-1 ${isRTL ? 'text-right' : ''}`}>
                <h3 className="font-display text-lg font-bold">{isRTL ? "متجر الأغراض" : "Items Store"}</h3>
                <p className="text-sm text-muted-foreground">
                  {isRTL ? "اشترِ المقتنيات والإطارات والمؤثرات" : "Buy cosmetics, frames and effects"}
                </p>
              </div>
              <div className="h-14 w-14 rounded-xl bg-gradient-to-br from-primary/20 to-pink-500/10 border border-primary/30 flex items-center justify-center">
                <Store className="h-7 w-7 text-primary" />
              </div>
            </div>
          </div>
        </Link>

        <Link href="/settings">
          <div className="mt-4 bg-gradient-to-br from-primary/10 via-pink-500/10 to-purple-500/10 border rounded-xl p-4 hover-elevate cursor-pointer" data-testid="card-settings-shortcut">
            <div className={`flex items-center gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
              {isRTL ? <ChevronLeft className="h-5 w-5 text-muted-foreground" /> : <ChevronRight className="h-5 w-5 text-muted-foreground" />}
              <div className={`flex-1 ${isRTL ? 'text-right' : ''}`}>
                <h3 className="font-display text-lg font-bold">{isRTL ? "الإعدادات" : "Settings"}</h3>
                <p className="text-sm text-muted-foreground">
                  {isRTL ? "تعديل الملف الشخصي واللغة والخصوصية" : "Edit profile, language and privacy"}
                </p>
              </div>
              <div className="h-14 w-14 rounded-xl bg-gradient-to-br from-primary/20 to-pink-500/10 border border-primary/30 flex items-center justify-center">
                <Settings className="h-7 w-7 text-primary" />
              </div>
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
}
