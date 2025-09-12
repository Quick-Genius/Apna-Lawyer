import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Textarea } from "./ui/textarea";
import { ArrowLeft, Upload, CheckCircle } from "lucide-react";

interface LawyerRegistrationPageProps {
  onBack: () => void;
  onRegistrationComplete: () => void;
}

export default function LawyerRegistrationPage({ onBack, onRegistrationComplete }: LawyerRegistrationPageProps) {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    licenseNumber: '',
    lawFirm: '',
    practiceAreas: '',
    yearsOfExperience: '',
    specialization: ''
  });
  const [certificationFile, setCertificationFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [field]: e.target.value
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setCertificationFile(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false);
      onRegistrationComplete();
    }, 2000);
  };

  const practiceAreaOptions = [
    "Corporate Law",
    "Criminal Law",
    "Family Law",
    "Immigration Law",
    "Real Estate Law",
    "Employment Law",
    "Intellectual Property",
    "Tax Law",
    "Environmental Law",
    "Personal Injury",
    "Civil Rights",
    "Other"
  ];

  return (
    <div className="min-h-screen bg-[#FCFCFC] p-4">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={onBack}
          className="flex items-center gap-2 text-[#36454F] hover:bg-[#AEC6CF]/10"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to login
        </Button>

        {/* Main Card */}
        <Card className="border border-[#AEC6CF]/20 shadow-lg bg-white">
          <CardHeader className="text-center space-y-2">
            <CardTitle className="text-2xl text-[#36454F]">
              Lawyer Registration
            </CardTitle>
            <CardDescription className="text-[#6B7280]">
              Complete your professional profile to join our network
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Personal Information */}
              <div className="space-y-4">
                <h3 className="font-medium text-[#36454F] border-b border-[#AEC6CF]/20 pb-2">
                  Personal Information
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="fullName">Full Name *</Label>
                    <Input
                      id="fullName"
                      type="text"
                      value={formData.fullName}
                      onChange={handleInputChange('fullName')}
                      required
                      className="border-[#AEC6CF]/30 focus:border-[#77DDE7]"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange('email')}
                      required
                      className="border-[#AEC6CF]/30 focus:border-[#77DDE7]"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number *</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={handleInputChange('phone')}
                      required
                      className="border-[#AEC6CF]/30 focus:border-[#77DDE7]"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="licenseNumber">License Number *</Label>
                    <Input
                      id="licenseNumber"
                      type="text"
                      value={formData.licenseNumber}
                      onChange={handleInputChange('licenseNumber')}
                      required
                      className="border-[#AEC6CF]/30 focus:border-[#77DDE7]"
                    />
                  </div>
                </div>
              </div>

              {/* Professional Information */}
              <div className="space-y-4">
                <h3 className="font-medium text-[#36454F] border-b border-[#AEC6CF]/20 pb-2">
                  Professional Information
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="lawFirm">Law Firm/Organization</Label>
                    <Input
                      id="lawFirm"
                      type="text"
                      value={formData.lawFirm}
                      onChange={handleInputChange('lawFirm')}
                      placeholder="Independent Practice, if applicable"
                      className="border-[#AEC6CF]/30 focus:border-[#77DDE7]"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="yearsOfExperience">Years of Experience *</Label>
                    <Select value={formData.yearsOfExperience} onValueChange={(value) => 
                      setFormData(prev => ({ ...prev, yearsOfExperience: value }))
                    }>
                      <SelectTrigger className="border-[#AEC6CF]/30 focus:border-[#77DDE7]">
                        <SelectValue placeholder="Select experience" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="0-1">0-1 years</SelectItem>
                        <SelectItem value="2-5">2-5 years</SelectItem>
                        <SelectItem value="6-10">6-10 years</SelectItem>
                        <SelectItem value="11-15">11-15 years</SelectItem>
                        <SelectItem value="16-20">16-20 years</SelectItem>
                        <SelectItem value="20+">20+ years</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="practiceAreas">Primary Practice Areas *</Label>
                  <Select value={formData.practiceAreas} onValueChange={(value) => 
                    setFormData(prev => ({ ...prev, practiceAreas: value }))
                  }>
                    <SelectTrigger className="border-[#AEC6CF]/30 focus:border-[#77DDE7]">
                      <SelectValue placeholder="Select primary practice area" />
                    </SelectTrigger>
                    <SelectContent>
                      {practiceAreaOptions.map((area) => (
                        <SelectItem key={area} value={area}>{area}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="specialization">Specialization (Optional)</Label>
                  <Textarea
                    id="specialization"
                    value={formData.specialization}
                    onChange={handleInputChange('specialization')}
                    placeholder="Describe your specific areas of expertise..."
                    className="border-[#AEC6CF]/30 focus:border-[#77DDE7] min-h-[100px]"
                  />
                </div>
              </div>

              {/* Certification Upload */}
              <div className="space-y-4">
                <h3 className="font-medium text-[#36454F] border-b border-[#AEC6CF]/20 pb-2">
                  Certification Documents
                </h3>
                
                <div className="space-y-2">
                  <Label>Upload Bar Certification/License *</Label>
                  <div className="border-2 border-dashed border-[#AEC6CF]/30 rounded-lg p-6 text-center hover:border-[#77DDE7]/50 transition-colors">
                    <input
                      type="file"
                      id="certification"
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={handleFileChange}
                      className="hidden"
                      required
                    />
                    <label htmlFor="certification" className="cursor-pointer">
                      {certificationFile ? (
                        <div className="flex items-center justify-center gap-2 text-green-600">
                          <CheckCircle className="h-5 w-5" />
                          <span>{certificationFile.name}</span>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          <Upload className="h-8 w-8 mx-auto text-[#AEC6CF]" />
                          <p className="text-[#6B7280]">
                            Click to upload or drag and drop
                          </p>
                          <p className="text-sm text-[#6B7280]">
                            PDF, JPG, PNG up to 10MB
                          </p>
                        </div>
                      )}
                    </label>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-[#D4AF37] hover:bg-[#D4AF37]/90 text-white py-3"
              >
                {isSubmitting ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-[#36454F]/20 border-t-[#36454F] rounded-full animate-spin" />
                    Processing Registration...
                  </div>
                ) : (
                  'Complete Registration'
                )}
              </Button>
            </form>

            <div className="mt-6 p-4 bg-[#F5E6CC]/30 rounded-lg border border-[#D4AF37]/20">
              <p className="text-sm text-[#6B7280]">
                <strong>Note:</strong> Your registration will be reviewed by our team. 
                You'll receive an email confirmation within 24-48 hours once approved.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center text-sm text-[#6B7280]">
          <p>Join the trusted network of legal professionals</p>
        </div>
      </div>
    </div>
  );
}