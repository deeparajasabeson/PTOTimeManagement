using Microsoft.EntityFrameworkCore;

namespace PTOTMT.Common.Entities
{
    public class PTOTMTWebAPIContext : DbContext
    {
        public PTOTMTWebAPIContext (DbContextOptions<PTOTMTWebAPIContext> options)  : base(options)
        {
        }
        public DbSet<Location> Location { get; set; }
        public DbSet<Quota> Quota { get; set; }
        public DbSet<Request> Request { get; set; }
        public DbSet<RequestType> RequestType { get; set; }
        public DbSet<Role> Role { get; set; }
        public DbSet<ShiftSlide> ShiftSlide { get; set; }
        public DbSet<Status> Status { get; set; }
        public DbSet<Team> Team { get; set; }
        public DbSet<TeamUser> TeamUser { get; set; }
        public DbSet<Title> Title { get; set; }
        public DbSet<User> User { get; set; }
        public DbSet<FlexType> FlexType { get; set; }
        public DbSet<Flex> Flex { get; set; }
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Location>().ToTable("Location", "Config");
            modelBuilder.Entity<Quota>().ToTable("Quota", "PTO");
            modelBuilder.Entity<Request>().ToTable("Request", "PTO");
            modelBuilder.Entity<Flex>().ToTable("User", "PTO");
            modelBuilder.Entity<RequestType>().ToTable("RequestType", "Config");
            modelBuilder.Entity<Role>().ToTable("Role", "Security");
            modelBuilder.Entity<ShiftSlide>().ToTable("ShiftSlide", "Config");
            modelBuilder.Entity<Status>().ToTable("Status", "Config");
            modelBuilder.Entity<FlexType>().ToTable("FlexType", "Config");
            modelBuilder.Entity<Team>().ToTable("Team", "Security");
            modelBuilder.Entity<TeamUser>().ToTable("TeamUser", "Security");
            modelBuilder.Entity<Title>().ToTable("Title", "Security");
            modelBuilder.Entity<User>().ToTable("User", "Security");
        }
    }
}
