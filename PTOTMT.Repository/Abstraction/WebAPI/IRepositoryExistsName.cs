using System;
using System.Collections.Generic;
using System.Text;

namespace PTOTMT.Repository.Abstraction.WebAPI
{
    public interface IRepositoryExistsName
    {
        bool ExistsName(string name);
    }
}
