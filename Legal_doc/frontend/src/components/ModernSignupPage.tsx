import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Card, CardContent } from "./ui/card";
import { Checkbox } from "./ui/checkbox";
import { ArrowLeft, Eye, EyeOff, Shield, MessageSquare, Scale, Check } from "lucide-react";

interface ModernSignupPageProps {
  onBack: () => void;
  onLawyerRegistration: () => void;
  onUserHome: () => void;
  onSwitchToLogin: () => void;
}

export default function ModernSignupPage({ 
  onBack, 
  onLawyerRegistration, 
  onUserHome,
  onSwitchToLogin 
}: ModernSignupPageProps) {
  const [registerAsLawyer, setRegisterAsLawyer] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const [passwordRequirements, setPasswordRequirements] = useState({
    length: false,
    uppercase: false,
    lowercase: false,
    number: false,
    special: false
  });

  const handlePasswordChange = (password: string) => {
    setFormData(prev => ({ ...prev, password }));
    
    setPasswordRequirements({
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /\d/.test(password),
      special: /[!@#$%^&*(),.?":{}|<>]/.test(password)
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (registerAsLawyer) {
      onLawyerRegistration();
    } else {
      onUserHome();
    }
  };

  const handleInputChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    if (field === 'password') {
      handlePasswordChange(e.target.value);
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: e.target.value
      }));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FCFCFC] to-[#F5E6CC]/30 flex">
      {/* Left Side - Form */}
      <div className="flex-1 flex items-center justify-center p-8 lg:p-12">
        <div className="w-full max-w-md space-y-8">
          {/* Back Button */}
          <Button
            variant="ghost"
            onClick={onBack}
            className="flex items-center gap-2 text-[#36454F] hover:bg-[#AEC6CF]/10 mb-4"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>

          {/* Header */}
          <div className="text-center space-y-2">
            <p className="text-sm text-[#6B7280]">
              Already a member? 
              <Button 
                variant="link" 
                onClick={onSwitchToLogin}
                className="text-[#D4AF37] hover:text-[#D4AF37]/80 p-1 ml-1"
              >
                Sign in
              </Button>
            </p>
            <h1 className="text-3xl text-[#36454F] mt-4">Sign Up</h1>
            <p className="text-[#6B7280]">
              Secure Your Communications with Apna Lawyer
            </p>
          </div>

          {/* Form */}
          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
            <CardContent className="p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="fullName">Full Name</Label>
                  <Input
                    id="fullName"
                    type="text"
                    value={formData.fullName}
                    onChange={handleInputChange('fullName')}
                    required
                    className="h-12 border-[#AEC6CF]/30 focus:border-[#D4AF37] bg-white"
                    placeholder="Enter your full name"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange('email')}
                    required
                    className="h-12 border-[#AEC6CF]/30 focus:border-[#D4AF37] bg-white"
                    placeholder="Enter your email"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={formData.password}
                      onChange={handleInputChange('password')}
                      required
                      className="h-12 border-[#AEC6CF]/30 focus:border-[#D4AF37] bg-white pr-12"
                      placeholder="Create a strong password"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 p-0"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                  
                  {/* Password Requirements */}
                  {formData.password && (
                    <div className="mt-3 p-3 bg-[#F5E6CC]/20 rounded-lg border border-[#D4AF37]/20">
                      <p className="text-sm text-[#36454F] mb-2">Password requirements:</p>
                      <div className="grid grid-cols-1 gap-1 text-xs">
                        <div className={`flex items-center gap-2 ${passwordRequirements.length ? 'text-green-600' : 'text-[#6B7280]'}`}>
                          <Check className={`h-3 w-3 ${passwordRequirements.length ? 'opacity-100' : 'opacity-30'}`} />
                          At least 8 characters
                        </div>
                        <div className={`flex items-center gap-2 ${passwordRequirements.uppercase ? 'text-green-600' : 'text-[#6B7280]'}`}>
                          <Check className={`h-3 w-3 ${passwordRequirements.uppercase ? 'opacity-100' : 'opacity-30'}`} />
                          One uppercase letter
                        </div>
                        <div className={`flex items-center gap-2 ${passwordRequirements.lowercase ? 'text-green-600' : 'text-[#6B7280]'}`}>
                          <Check className={`h-3 w-3 ${passwordRequirements.lowercase ? 'opacity-100' : 'opacity-30'}`} />
                          One lowercase letter
                        </div>
                        <div className={`flex items-center gap-2 ${passwordRequirements.number ? 'text-green-600' : 'text-[#6B7280]'}`}>
                          <Check className={`h-3 w-3 ${passwordRequirements.number ? 'opacity-100' : 'opacity-30'}`} />
                          One number
                        </div>
                        <div className={`flex items-center gap-2 ${passwordRequirements.special ? 'text-green-600' : 'text-[#6B7280]'}`}>
                          <Check className={`h-3 w-3 ${passwordRequirements.special ? 'opacity-100' : 'opacity-30'}`} />
                          One special character
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <div className="relative">
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      value={formData.confirmPassword}
                      onChange={handleInputChange('confirmPassword')}
                      required
                      className="h-12 border-[#AEC6CF]/30 focus:border-[#D4AF37] bg-white pr-12"
                      placeholder="Confirm your password"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 p-0"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>

                <div className="flex items-center space-x-3 p-4 bg-gradient-to-r from-[#D4AF37]/10 to-[#F5E6CC]/20 rounded-lg border border-[#D4AF37]/20">
                  <Checkbox
                    id="registerAsLawyer"
                    checked={registerAsLawyer}
                    onCheckedChange={setRegisterAsLawyer}
                    className="border-[#D4AF37] data-[state=checked]:bg-[#D4AF37]"
                  />
                  <Label 
                    htmlFor="registerAsLawyer" 
                    className="text-sm cursor-pointer flex items-center gap-2"
                  >
                    <Scale className="h-4 w-4 text-[#D4AF37]" />
                    Register as a Lawyer
                  </Label>
                </div>

                <Button
                  type="submit"
                  className="w-full h-12 bg-[#D4AF37] hover:bg-[#D4AF37]/90 text-white rounded-lg"
                >
                  Sign Up
                </Button>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-[#AEC6CF]/20" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-white px-2 text-[#6B7280]">Or Sign up with</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <Button
                    type="button"
                    variant="outline"
                    className="h-12 border-[#AEC6CF]/30 hover:bg-[#AEC6CF]/10"
                  >
                    <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                      <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                      <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                    Google
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    className="h-12 border-[#AEC6CF]/30 hover:bg-[#AEC6CF]/10"
                  >
                    <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                    </svg>
                    Facebook
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Right Side - Visual */}
      <div className="hidden lg:flex flex-1 bg-gradient-to-br from-[#D4AF37]/20 to-[#F5E6CC]/40 items-center justify-center p-12">
        <div className="max-w-md text-center space-y-8">
          <div className="grid grid-cols-2 gap-6">
            <Card className="p-6 bg-white/80 backdrop-blur-sm border-0 shadow-lg">
              <div className="w-12 h-12 bg-gradient-to-br from-[#D4AF37] to-[#F5E6CC] rounded-xl flex items-center justify-center mx-auto mb-4">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-sm text-[#36454F] mb-2">Secure Platform</h3>
              <p className="text-xs text-[#6B7280]">Your data is protected with enterprise-grade security</p>
            </Card>
            
            <Card className="p-6 bg-white/80 backdrop-blur-sm border-0 shadow-lg">
              <div className="w-12 h-12 bg-gradient-to-br from-[#D4AF37] to-[#F5E6CC] rounded-xl flex items-center justify-center mx-auto mb-4">
                <MessageSquare className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-sm text-[#36454F] mb-2">Easy Communication</h3>
              <p className="text-xs text-[#6B7280]">Connect with lawyers seamlessly</p>
            </Card>
            
            <Card className="p-6 bg-white/80 backdrop-blur-sm border-0 shadow-lg col-span-2">
              <div className="w-12 h-12 bg-gradient-to-br from-[#D4AF37] to-[#F5E6CC] rounded-xl flex items-center justify-center mx-auto mb-4">
                <Scale className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-sm text-[#36454F] mb-2">Legal Expertise</h3>
              <p className="text-xs text-[#6B7280]">Access to qualified legal professionals and AI-powered assistance</p>
            </Card>
          </div>
          
          <div className="text-center">
            <h2 className="text-2xl text-[#36454F] mb-4">Join thousands of users</h2>
            <p className="text-[#6B7280]">
              "Understand before you sign" - Get legal clarity with confidence
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}