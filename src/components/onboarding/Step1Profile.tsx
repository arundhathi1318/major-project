import { useFinance } from '@/contexts/FinanceContext';
import { User, MapPin, Users, Briefcase } from 'lucide-react';

export function Step1Profile() {
  const { data, updateProfile } = useFinance();
  const { profile } = data;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="text-center mb-8">
        <div className="w-16 h-16 finpilot-gradient rounded-2xl flex items-center justify-center mx-auto mb-4">
          <User className="w-8 h-8 text-primary-foreground" />
        </div>
        <h2 className="text-2xl font-display font-bold text-foreground">Personal Profile</h2>
        <p className="text-muted-foreground mt-2">Tell us a bit about yourself</p>
      </div>

      <div className="grid gap-5">
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Full Name</label>
          <input
            type="text"
            value={profile.fullName}
            onChange={(e) => updateProfile({ fullName: e.target.value })}
            placeholder="John Doe"
            className="finpilot-input"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Age</label>
            <input
              type="number"
              value={profile.age}
              onChange={(e) => updateProfile({ age: parseInt(e.target.value) || 0 })}
              min={18}
              max={100}
              className="finpilot-input"
              placeholder="Enter your age"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Gender</label>
            <select
              value={profile.gender}
              onChange={(e) => updateProfile({ gender: e.target.value as typeof profile.gender })}
              className="finpilot-input"
              aria-label="Gender"
            >
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
              <option value="prefer-not-to-say">Prefer not to say</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              <MapPin className="w-4 h-4 inline mr-1" /> City
            </label>
            <input
              type="text"
              value={profile.city}
              onChange={(e) => updateProfile({ city: e.target.value })}
              placeholder="Mumbai"
              className="finpilot-input"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Country</label>
            <input
              type="text"
              value={profile.country}
              onChange={(e) => updateProfile({ country: e.target.value })}
              placeholder="India"
              className="finpilot-input"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="maritalStatus" className="block text-sm font-medium text-foreground mb-2">
              <Users className="w-4 h-4 inline mr-1" /> Marital Status
            </label>
            <select
              id="maritalStatus"
              value={profile.maritalStatus}
              onChange={(e) => updateProfile({ maritalStatus: e.target.value as typeof profile.maritalStatus })}
              className="finpilot-input"
              aria-label="Marital Status"
            >
              <option value="single">Single</option>
              <option value="married">Married</option>
              <option value="divorced">Divorced</option>
              <option value="widowed">Widowed</option>
            </select>
          </div>
          <div>
            <label htmlFor="familyType" className="block text-sm font-medium text-foreground mb-2">Family Type</label>
            <select
              id="familyType"
              value={profile.familyType}
              onChange={(e) => updateProfile({ familyType: e.target.value as typeof profile.familyType })}
              className="finpilot-input"
              aria-label="Family Type"
            >
              <option value="single">Single</option>
              <option value="couple">Couple</option>
              <option value="family-with-children">Family with Children</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Number of Dependents</label>
            <input
              type="number"
              value={profile.dependents}
              onChange={(e) => updateProfile({ dependents: parseInt(e.target.value) || 0 })}
              min={0}
              max={10}
              className="finpilot-input"
              placeholder="Enter number of dependents"
              title="Number of Dependents"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              <Briefcase className="w-4 h-4 inline mr-1" /> Employment
            </label>
            <select
              value={profile.employmentType}
              onChange={(e) => updateProfile({ employmentType: e.target.value as typeof profile.employmentType })}
              className="finpilot-input"
              aria-label="Employment Type"
              title="Employment Type"
            >
              <option value="student">Student</option>
              <option value="salaried">Salaried</option>
              <option value="self-employed">Self-employed</option>
              <option value="freelancer">Freelancer</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}
