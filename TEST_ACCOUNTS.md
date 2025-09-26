# Test Accounts for MelMilaap

## Database Tables Used for Profiles
- **Primary Table**: `user_profiles` - Contains all profile data (currently 8 profiles)
- **Photos Table**: `profile_photos` - Contains profile photo URLs  
- **Auth Table**: `auth.users` - Supabase authentication (1 user)

## Current Test Data Status
- ❌ **Authentication**: Only 1 real auth user exists
- ✅ **Profile Data**: 8+ test profiles exist in `user_profiles` table
- ✅ **Photos**: Profile photos linked to test user IDs
- ❌ **Logins**: No authentication credentials for test profiles

## Available Test Profiles in Database
1. **Jag Singh** (Your current user) - Engineer, Melbourne
2. **Additional profiles needed**: 20-30 more profiles for comprehensive testing

## Test Account Requirements
To properly test the matrimonial features, we need:

### Authentication Setup Required
- Create actual Supabase auth users for test profiles
- Link auth users to existing profile data
- Provide login credentials (email/password) for all test accounts

### Test Coverage Needed
- **User Types**: Free tier users, Premium users, Family accounts
- **Gender Distribution**: Equal male/female profiles 
- **Geographic Diversity**: Different cities/states
- **Age Range**: 22-35 years for realistic matching
- **Profession Variety**: Different occupations and income levels

## Manual Setup Required
Since automated auth user creation failed, test accounts need to be created manually:

1. **Method 1**: Use Supabase Dashboard Auth section to create users
2. **Method 2**: Create accounts through the app's signup flow
3. **Method 3**: Use Supabase CLI or direct API calls

## Next Steps
1. ✅ Fix profile photo display for current user
2. ✅ Fix upgrade button functionality
3. ❌ Create 25+ test auth accounts with credentials
4. ❌ Test matching and messaging between accounts

## Current Issues
- PhotoManager not showing current user's photos properly
- Upgrade button not functional
- Insufficient test data for comprehensive feature testing