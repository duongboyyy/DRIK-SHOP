using System.Collections.Generic;

namespace API.Dtos
{
    public class UserRolesDto
    {
        public string UserId { get; set; }
        public List<string> RoleIds { get; set; }
    }

}
