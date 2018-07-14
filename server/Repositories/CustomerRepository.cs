using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Dynamic.Core;

namespace server.Repositories
{
    public class CustomersRepository : ICustomersRepository
    {
        private readonly ConcurrentDictionary<int, Customer> _storage = new ConcurrentDictionary<int, Customer>();

        public Customer GetSingle(int id)
        {
            Customer item;
            return _storage.TryGetValue(id, out item) ? item : null;
        }

        public void Add(Customer item)
        {
            item.Id = !_storage.Values.Any() ? 1 : _storage.Values.Max(x => x.Id) + 1;

            if (!_storage.TryAdd(item.Id, item))
            {
                throw new Exception("Item could not be added");
            }
        }

        public void Delete(int id)
        {
            Customer item;
            if (!_storage.TryRemove(id, out item))
            {
                throw new Exception("Item could not be removed");
            }
        }

        public Customer Update(int id, Customer item)
        {
            _storage.TryUpdate(id, item, GetSingle(id));
            return item;
        }

        public IQueryable<Customer> GetAll()
        {
            IQueryable<Customer> _allItems = _storage.Values.AsQueryable();
            return _allItems;
        }

        public int Count()
        {
            return _storage.Count;
        }

        public bool Save()
        {
            // To keep interface consistent with Controllers, Tests & EF Interfaces
            return true;
        }
    }
}