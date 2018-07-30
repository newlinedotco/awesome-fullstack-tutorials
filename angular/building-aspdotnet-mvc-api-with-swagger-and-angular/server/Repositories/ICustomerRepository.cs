using server.Models;
using System.Linq;

namespace server.Repositories
{
    public interface ICustomerRepository
    {
        Customer GetSingle(int id);
        void Add(Customer item);
        void Delete(int id);
        Customer Update(int id, Customer item);
        IQueryable<Customer> GetAll();
        int Count();
        bool Save();
    }
}