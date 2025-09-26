# Test User Accounts

I've created test user profiles in the database that you can use for testing. However, these accounts don't have authentication credentials yet because Supabase manages the auth table separately.

## Created Test Profiles (Database Only)

The following test profiles have been created in the user_profiles table:

1. **User ID**: 11111111-1111-1111-1111-111111111111
   - **Name**: Priya S.
   - **Profession**: Software Engineer
   - **Location**: Sydney, NSW
   - **Subscription**: Premium
   - **Photo**: /src/assets/profile-1.jpg

2. **User ID**: 22222222-2222-2222-2222-222222222222
   - **Name**: Anjali K.
   - **Profession**: Doctor
   - **Location**: Melbourne, VIC
   - **Subscription**: Free
   - **Photo**: /src/assets/profile-2.jpg

3. **User ID**: 33333333-3333-3333-3333-333333333333
   - **Name**: Shreya M.
   - **Profession**: Marketing Manager
   - **Location**: Brisbane, QLD
   - **Subscription**: Premium
   - **Photo**: /src/assets/profile-3.jpg

4. **User ID**: 44444444-4444-4444-4444-444444444444
   - **Name**: Kavya R.
   - **Profession**: Teacher
   - **Location**: Perth, WA
   - **Subscription**: Free
   - **Photo**: /src/assets/profile-4.jpg

5. **User ID**: 55555555-5555-5555-5555-555555555555
   - **Name**: Meera T.
   - **Profession**: Architect
   - **Location**: Adelaide, SA
   - **Subscription**: Premium
   - **Photo**: /src/assets/profile-5.jpg

## Next Steps for Testing

To create full test accounts with login credentials, you would need to:

1. Use Supabase Dashboard to manually create auth users
2. Or use Supabase Auth API to programmatically create accounts
3. Link these auth users to the existing profiles using the user_id

## Current Functionality

- ✅ Profile data loads from database in Matches and Search pages
- ✅ Profile photos display correctly  
- ✅ Upgrade button now links to premium page
- ✅ Fixed database constraints for user activity stats

The profiles will now appear in your Matches and Search pages using real database data instead of static dummy data.