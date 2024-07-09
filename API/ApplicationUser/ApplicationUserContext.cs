using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace API.ApplicationUser
{
    public class ApplicationUserContext : IdentityDbContext<ApplicationUser>
    {
        public ApplicationUserContext(DbContextOptions<ApplicationUserContext> options) : base(options) { }
    }
}
